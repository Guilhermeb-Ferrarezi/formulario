import express from "express";
import cors from "cors";
import alunoRouter from "./routes/aluno.routes";
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ 
  credentials: true, 
  origin: true // Permite qualquer origem (você pode restringir depois)
}));
app.use(express.json());

// ===== ROTAS DA API =====
app.use("/api/alunos", alunoRouter);
app.use("/api/auth", authRouter);

// Rota de health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Inicialização
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://0.0.0.0:${PORT}/health`);
});

// Tratamento de sinais
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recebido, mas mantendo servidor ativo");
});

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT recebido, mas mantendo servidor ativo");
});