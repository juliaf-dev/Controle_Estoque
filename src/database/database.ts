import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false,
    underscored: false,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao Neon!"))
  .catch((err) => console.error("Erro na conexão:", err));

export default sequelize;
