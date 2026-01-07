import express from "express";
import cors from "cors";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 80;

// CORS para frontend e dashboard remoto
app.use(cors({
  origin: [
    "https://sga.santos-tech.com",
    "https://api.santos-tech.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rotas
app.use("/auth", authRouter);       // login do dashboard
app.use("/alunos", alunoRouter);    // rotas protegidas

// Inicialização do banco e servidor
(async () => {
  try {
    await initConfig();
    console.log("✅ Tabela alunos pronta");

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
  }
})();
