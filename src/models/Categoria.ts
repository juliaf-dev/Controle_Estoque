import { Model, DataTypes, Sequelize } from 'sequelize';

export interface CategoriaAttributes {
  id?: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoriaCreationAttributes extends Omit<CategoriaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes> implements CategoriaAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCategoriaModel = (sequelize: Sequelize): void => {
  Categoria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
      tableName: 'categorias',
      timestamps: true,
    }
  );
};

export default Categoria; 