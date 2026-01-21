import express from "express";
import cors from "cors";
import alunoRoutes from "./routes/aluno.routes";
import authRouter from "./routes/auth.routes.js";
import { initConfig } from "./config/init.ts";

const app = express();
const PORT = Number(process.env.PORT);

// Middlewares
app.use(cors({
  credentials: true,
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ===== ROTAS DA API =====
app.use("/api/alunos", alunoRoutes); // Rotas protegidas e públicas
app.use("/api/auth", authRouter);

// Rota de health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rota de teste simples
app.get("/test", (_req, res) => {
  res.send("API is working!");
});

// Rota raiz
app.get("/", (_req, res) => {
  res.json({
    message: "API Santos Tech",
    health: "/health",
    endpoints: ["/api/alunos", "/api/auth"]
  });
});

// Tratamento de sinais - IGNORA SIGTERM para não encerrar
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recebido - IGNORANDO (servidor continua rodando)");
  // NÃO faz nada - mantém o servidor ativo
});

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT recebido - encerrando...");
  process.exit(0);
});

// Inicialização
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📍 Endpoints disponíveis:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/alunos/public (cadastro público)`);
  console.log(`   - GET  /api/alunos (protegida)`);
  console.log(`   - GET  /api/alunos/:id (protegida)`);
  console.log(`   - PUT  /api/alunos/:id (protegida)`);
  console.log(`   - DELETE /api/alunos/:id (protegida)`);
});

initConfig().then(() => {
  console.log("✅ Configuração inicial concluída");
}).catch((erro) => {
  console.error("❌ Erro na configuração inicial:", erro);
  process.exit(1);
});