const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: false,
    underscored: false,
  },
});
sequelize
  .authenticate()
  .then(() => console.log("Conectado ao Neon!"))
  .catch((err: any) => console.error("Erro na conexão:", err));

export default sequelize;