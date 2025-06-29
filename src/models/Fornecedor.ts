import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize, Op } from 'sequelize';

interface FornecedorAttributes {
    id: number;
    nome: string;
    situacao: number;
    email: string;
    telefone: string;
    tempo_entrega: number;
}

interface FornecedorCreationAttributes extends Optional<FornecedorAttributes, 'id'> {}

class Fornecedor extends Model<FornecedorAttributes, FornecedorCreationAttributes>
    implements FornecedorAttributes {
        public id!: number;
        public nome!: string;
        public situacao!: number;
        public email!: string;
        public telefone!: string;
        public tempo_entrega!: number;

    static async registrar(dados: { nome: string; situacao: number; email: string; telefone: string; tempo_entrega: number }) {
        return await Fornecedor.create({
            nome: dados.nome,
            situacao: dados.situacao,
            email: dados.email,
            telefone: dados.telefone,
            tempo_entrega: dados.tempo_entrega
        });
    }

    static async atualizar(dados: { id: number; nome: string; situacao: number; email: string; telefone: string; tempo_entrega: number }) {
        return await Fornecedor.update(
            {
                nome: dados.nome,
                situacao: dados.situacao,
                email: dados.email,
                telefone: dados.telefone,
                tempo_entrega: dados.tempo_entrega
            },
            {
                where: { id: dados.id }
            }
        );
    }

    static async apagar(id: number) {
        return await Fornecedor.destroy({
            where: { id }
        });
    }
}

export function initFornecedorModel(sequelize: Sequelize) {
    Fornecedor.init(
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
            situacao: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            telefone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tempo_entrega: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 7
            }
        },
        {
            sequelize,
            modelName: 'Fornecedor',
            tableName: 'fornecedores',
            underscored: true,
            timestamps: true
        }
    );
    return Fornecedor;
}

export default Fornecedor;