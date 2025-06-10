import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Sequelize, Op } from 'sequelize';
import { randomBytes } from 'crypto';

interface UsuarioAttributes {
    id: number;
    nome: string;
    senha: string;
    email: string;
    tipo: string;
    token_recuperacao_senha: string | null;
    token_expiracao: Date | null;
    tentativas_login: number;
    refresh_token: string | null;
}

interface UsuarioCreationAttributes
    extends Optional<UsuarioAttributes, 'id' | 'token_recuperacao_senha' | 'token_expiracao' | 'tentativas_login' | 'refresh_token'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    public id!: number;
    public nome!: string;
    public senha!: string;
    public email!: string;
    public tipo!: string;
    public token_recuperacao_senha!: string | null;
    public token_expiracao!: Date | null;
    public tentativas_login!: number;
    public refresh_token!: string | null;

    static async registrar(dados: { nome: string; email: string; senha: string; tipo?: string }) {
        const isFirstUser = (await Usuario.count()) === 0;
        const tipo = isFirstUser ? 'admin' : dados.tipo || 'user';
        
        const senhaHash = await bcrypt.hash(dados.senha, 12);
        return await Usuario.create({
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash,
            tipo,
            tentativas_login: 0,
            token_recuperacao_senha: null,
            token_expiracao: null,
            refresh_token: null
        });
    }

    static async gerarTokenRecuperacao(email: string): Promise<string | null> {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return null;

        const token = randomBytes(32).toString('hex');
        const expiracao = new Date(Date.now() + 3600000); // 1 hora

        await usuario.update({
            token_recuperacao_senha: token,
            token_expiracao: expiracao
        });

        return token;
    }

    static async resetarSenha(token: string, novaSenha: string): Promise<boolean> {
        const usuario = await Usuario.findOne({ 
            where: { 
                token_recuperacao_senha: token,
                token_expiracao: { [Op.gt]: new Date() }
            } 
        });

        if (!usuario) return false;

        const senhaHash = await bcrypt.hash(novaSenha, 12);
        await usuario.update({
            senha: senhaHash,
            token_recuperacao_senha: null,
            token_expiracao: null
        });

        return true;
    }
}

export function initUsuarioModel(sequelize: Sequelize) {
    Usuario.init(
        {
            id: {
                type: DataTypes.INTEGER,
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
                allowNull: false,
                defaultValue: 'user'
            },
            token_recuperacao_senha: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'token_recuperacao_senha'
            },
            token_expiracao: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'token_expiracao'
            },
            tentativas_login: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'tentativas_login'
            },
            refresh_token: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'refresh_token'
            }
        },
        {
            sequelize,
            modelName: 'Usuario',
            tableName: 'usuarios',
            underscored: true,
            timestamps: true
        }
    );
    return Usuario;
}

export default Usuario;