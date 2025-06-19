import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/categories";
import dotenv from "dotenv";
import sequelize from "./database/database";
import { initUsuarioModel } from "./models/Usuario";
import { initCategoriaModel } from "./models/Categoria";
import fornecedorRoutes from "./routes/fornecedor";

// Carrega as variáveis de ambiente
dotenv.config();
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Inicializa os modelos
initUsuarioModel(sequelize);
initCategoriaModel(sequelize);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rotas de autenticação
app.use("/auth", authRoutes);
app.use("/fornecedor", fornecedorRoutes);

// Rotas de categorias
app.use("/", categoryRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API de Controle de Estoque" });
});

// Tratamento de erros
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("Tabelas sincronizadas");
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
});
