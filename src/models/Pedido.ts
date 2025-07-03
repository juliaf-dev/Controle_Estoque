import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface PedidoAttributes {
  id: number;
  nome: string;
  valor: number;
  tipo: string;
  produto_id?: number | null;
  quantidade: number;
  data_entrega?: Date | null;
  cliente_id?: number | null;
  fornecedor_id?: number | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PedidoCreationAttributes extends Optional<PedidoAttributes, 'id' | 'data_entrega'> {}

class Pedido extends Model<PedidoAttributes, PedidoCreationAttributes>
  implements PedidoAttributes {
  public id!: number;
  public nome!: string;
  public valor!: number;
  public tipo!: string;
  public produto_id!: number | null;
  public quantidade!: number;
  public data_entrega!: Date | null;
  public cliente_id!: number | null;
  public fornecedor_id!: number | null;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para registrar
  static async registrar(dados: PedidoCreationAttributes) {
    return await Pedido.create(dados);
  }

  // Método para atualizar
  static async atualizar(id: number, dados: Partial<Omit<PedidoAttributes, 'id'>>) {
    return await Pedido.update(dados, {
      where: { id }
    });
  }

  // Método para apagar
  static async apagar(id: number) {
    return await Pedido.destroy({
      where: { id }
    });
  }
}

// Inicializador para o model
export function initPedidoModel(sequelize: Sequelize) {
  Pedido.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'produtos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      data_entrega: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      fornecedor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'fornecedores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'a-caminho',
      },
    },
    {
      sequelize,
      modelName: 'Pedido',
      tableName: 'pedidos',
      underscored: true,
      timestamps: true,
    }
  );
  return Pedido;
}

export default Pedido;
