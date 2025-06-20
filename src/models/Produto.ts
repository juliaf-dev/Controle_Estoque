import { Model, DataTypes, Sequelize } from 'sequelize';
import { Categoria } from './Categoria';
import { Cliente } from './Cliente';

export interface ProdutoAttributes {
  id?: number;
  codigo: number;
  nome: string;
  categoria_id: number;
  quantidade_estoque: number;
  valor: number;
  descricao?: string;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoCreationAttributes extends Omit<ProdutoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
  public id!: number;
  public codigo!: number;
  public nome!: string;
  public categoria_id!: number;
  public quantidade_estoque!: number;
  public valor!: number;
  public descricao?: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações
  public readonly categoria?: Categoria;
  public readonly clientes?: Cliente[];

  // Métodos de associação do Sequelize
  public setClientes!: (clientes: number[]) => Promise<void>;
  public addClientes!: (clientes: number[]) => Promise<void>;
  public removeClientes!: (clientes: number[]) => Promise<void>;
}

export const initProdutoModel = (sequelize: Sequelize): void => {
  Produto.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nome: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
      quantidade_estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'produtos',
      timestamps: true,
    }
  );
};

export const associateProduto = (): void => {
  Produto.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria',
  });
  
  Produto.belongsToMany(Cliente, {
    through: 'cliente_produtos',
    foreignKey: 'produto_id',
    otherKey: 'cliente_id',
    as: 'clientes',
  });
};

export default Produto; 