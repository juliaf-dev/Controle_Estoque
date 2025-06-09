// src/models/Usuario.ts
import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

// Adicione esta linha para importar o Op corretamente
import { Op } from 'sequelize';

interface UsuarioAttributes {
    id: number;
    nome: string;
    senha: string;
    email: string;
    tipo: string;
    tokenRecuperacaoSenha: string | null;
    tokenExpiracao: Date | null;
    tentativasLogin: number;
}

interface UsuarioCreationAttributes
    extends Optional<UsuarioAttributes, 'id' | 'tokenRecuperacaoSenha' | 'tokenExpiracao' | 'tentativasLogin'> { }

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    public id!: number;
    public nome!: string;
    public senha!: string;
    public email!: string;
    public tipo!: string;
    public tokenRecuperacaoSenha!: string | null;
    public tokenExpiracao!: Date | null;
    public tentativasLogin!: number;

    static async registrar(dados: { nome: string; email: string; senha: string; tipo: string }) {
        const { nome, email, senha, tipo } = dados;
        const senhaHash = await bcrypt.hash(senha, 10);
        return await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            tipo,
            tentativasLogin: 0,
            tokenRecuperacaoSenha: null,
            tokenExpiracao: null
        });
    }

    static async gerarTokenRecuperacao(email: string): Promise<string | null> {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return null;

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracao = new Date();
        expiracao.setHours(expiracao.getHours() + 1);

        await usuario.update({
            tokenRecuperacaoSenha: token,
            tokenExpiracao: expiracao
        });

        return token;
    }

    static async resetarSenha(token: string, novaSenha: string): Promise<boolean> {
        const usuario = await Usuario.findOne({ 
            where: { 
                tokenRecuperacaoSenha: token,
                tokenExpiracao: { [Op.gt]: new Date() } // Usando Op corretamente
            } 
        });

        if (!usuario) return false;

        const senhaHash = await bcrypt.hash(novaSenha, 10);
        await usuario.update({
            senha: senhaHash,
            tokenRecuperacaoSenha: null,
            tokenExpiracao: null
        });

        return true;
    }
}

export function initUsuarioModel(sequelize: Sequelize) {
    Usuario.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true }
            },
            tipo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tokenRecuperacaoSenha: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tokenExpiracao: {
                type: DataTypes.DATE,
                allowNull: true
            },
            tentativasLogin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Usuario',
            tableName: 'usuarios'
        }
    );
    return Usuario;
}
export default Usuario;