import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize, Op } from 'sequelize';

interface FornecedorAttributes {
    id: number;
    nome: string;
    situacao: number
}

interface FornecedorCreationAttributes
    extends Optional<FornecedorAttributes, 'id'> {}

class Fornecedor extends Model<FornecedorAttributes, FornecedorCreationAttributes>
    implements FornecedorAttributes {
        public id!: number;
        public nome!: string;
        public situacao!: number;

    static async registrar(dados: { nome: string; situacao: number }) {
        return await Fornecedor.create({
            nome: dados.nome,
            situacao: dados.situacao
        });
    }
    static async atualizar(dados: { id: number ,nome: string; situacao: number }) {
        return await Fornecedor.update(
            {
                nome: dados.nome,
                situacao: dados.situacao
            },
            {
                where: { id: dados.id }
            }
        );
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