import { Model, DataTypes, Sequelize } from 'sequelize';
import { Produto } from './Produto';

export interface ClienteAttributes {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cpf?: string;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClienteCreationAttributes extends Omit<ClienteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public telefone?: string;
  public endereco?: string;
  public cpf?: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações
  public readonly produtos?: Produto[];

  // Métodos de associação do Sequelize
  public setProdutos!: (produtos: number[]) => Promise<void>;
  public addProdutos!: (produtos: number[]) => Promise<void>;
  public removeProdutos!: (produtos: number[]) => Promise<void>;
}

export const initClienteModel = (sequelize: Sequelize): void => {
  Cliente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      endereco: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cpf: {
        type: DataTypes.STRING(14),
        allowNull: true,
        unique: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'clientes',
      timestamps: true,
    }
  );
};

export const associateCliente = (): void => {
  Cliente.belongsToMany(Produto, {
    through: 'cliente_produtos',
    foreignKey: 'cliente_id',
    otherKey: 'produto_id',
    as: 'produtos',
  });
};

export default Cliente; 