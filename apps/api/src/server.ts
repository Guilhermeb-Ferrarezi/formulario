import express from "express";
import cors from "cors";
import path from "path";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";
import { autenticarDashboard } from "./middlewares/autenticarDashboard";

const app = express();
const PORT = process.env.PORT || 80;

// =======================
// Configuração CORS
// =======================
app.use(
  cors({
    origin: [
      "https://sga.santos-tech.com",
      "https://api.santos-tech.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================
// Middleware para JSON
// =======================
app.use(express.json());

// =======================
// Rotas do dashboard
// =======================
const dashboardPath = path.resolve(__dirname, "../web/dist");

// Servir arquivos estáticos do dashboard
app.use("/dashboard", autenticarDashboard, express.static(dashboardPath));

// Fallback para React Router (qualquer rota que não seja arquivo físico)
app.get("/dashboard/*", autenticarDashboard, (_req, res) => {
  res.sendFile(path.join(dashboardPath, "index.html"));
});

// =======================
// Rotas da API
// =======================
app.use("/alunos", alunoRouter);

// =======================
// Inicialização do banco e servidor
// =======================
(async () => {
  try {
    await initConfig();
    console.log("✅ Tabela alunos pronta");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
  }
})();
