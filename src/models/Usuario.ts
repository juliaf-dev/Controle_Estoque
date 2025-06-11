import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UsuarioAttributes {
    id: number;
    nome: string;
    senha: string;
    email: string;
    tipo: string;
    token_recuperacao_senha: string;
    tentativas_login: number;
}

interface UsuarioCreationAttributes
    extends Optional<UsuarioAttributes, 'id' | 'token_recuperacao_senha' | 'tentativas_login'> { }

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    public id!: number;
    public nome!: string;
    public senha!: string;
    public email!: string;
    public tipo!: string;
    public token_recuperacao_senha!: string;
    public tentativas_login!: number;

    static async registrar(dados: { nome: string; email: string; senha: string; tipo: string }) {
        const { nome, email, senha, tipo } = dados;

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            tipo,
            tentativas_login: 0,
            token_recuperacao_senha: ''
        });

        return usuario;
    }

    static async aumentarTentativasLogin(email: string) {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        usuario.tentativas_login += 1;
        await usuario.save();
        return usuario;
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
                type: DataTypes.ENUM('A', 'U'),
                allowNull: false
            },
            token_recuperacao_senha: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ''
            },
            tentativas_login: {
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