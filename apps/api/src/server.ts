import express from "express";
import cors from "cors";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

const app = express();
const PORT = process.env.PORT;

// CORS
app.use(cors({
  origin: ["https://sga.santos-tech.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON middleware
app.use(express.json());

// Rotas
app.use("/alunos", alunoRouter);

// Inicialização do banco e servidor
(async () => {
  try {
    await initConfig(); // cria tabela se não existir
    console.log("✅ Tabela alunos pronta");

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
  }
})();
