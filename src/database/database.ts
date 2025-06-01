const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "ControleEstoqueDB",
  define: {
    timestamps: true,
    underscored: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao MySQL!"))
  .catch((err: any) => console.error("Erro na conexão:", err));

module.exports = sequelize;
