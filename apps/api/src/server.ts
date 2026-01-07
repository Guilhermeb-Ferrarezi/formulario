import express from "express";
import cors from "cors";
import alunoRouter from "./routes/aluno.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors({ 
  credentials: true, 
  origin: true
}));
app.use(express.json());

// ===== ROTAS DA API =====
app.use("/api/alunos", alunoRouter);
app.use("/api/auth", authRouter);

// Rota de health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rota raiz
app.get("/", (_req, res) => {
  res.json({ 
    message: "API Santos Tech",
    health: "/health",
    endpoints: ["/api/alunos", "/api/auth"]
  });
});

// Tratamento de sinais (evita que SIGTERM mate o processo imediatamente)
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recebido - aguardando conexões finalizarem...");
  server.close(() => {
    console.log("✅ Servidor encerrado graciosamente");
    process.exit(0);
  });
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
  console.log(`   - GET  /api/alunos`);
  console.log(`   - POST /api/alunos`);
});