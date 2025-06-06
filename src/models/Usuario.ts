import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UsuarioAttributes {
    id: number;
    nome: string;
    senha: string;
    email: string;
    tipo: string;
    tokenRecuperacaoSenha: string;
    tentativasLogin: number;
}

interface UsuarioCreationAttributes
    extends Optional<UsuarioAttributes, 'id' | 'tokenRecuperacaoSenha' | 'tentativasLogin'> { }

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    public id!: number;
    public nome!: string;
    public senha!: string;
    public email!: string;
    public tipo!: string;
    public tokenRecuperacaoSenha!: string;
    public tentativasLogin!: number;

    static async registrar(dados: { nome: string; email: string; senha: string; tipo: string }) {
        const { nome, email, senha, tipo } = dados;

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            tipo,
            tentativasLogin: 0,
            tokenRecuperacaoSenha: ''
        });

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
                type: DataTypes.STRING,
                allowNull: false
            },
            tokenRecuperacaoSenha: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ''
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