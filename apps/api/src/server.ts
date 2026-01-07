import express from "express";
import cors from "cors";
import path from "path";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

// Middleware de autenticação
function autenticarDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const senha = req.headers["x-dashboard-password"];
  const SENHA_CORRETA = process.env.DASHBOARD_PASSWORD || "minhasenha123";
  if (senha === SENHA_CORRETA) return next();
  return res.status(401).send("❌ Senha incorreta para acessar o dashboard");
}

const app = express();
const PORT = process.env.PORT || 80;
const dashboardPath = path.resolve(__dirname, "../web/dist");

// CORS e JSON
app.use(
  cors({
    origin: [
      "https://sga.santos-tech.com",
      "https://api.santos-tech.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-dashboard-password"],
  })
);
app.use(express.json());

// API
app.use("/alunos", alunoRouter);

// Servir arquivos estáticos (JS/CSS/imagens)
app.use("/dashboard/static", express.static(path.join(dashboardPath, "static")));

// Rota principal do dashboard
app.get("/dashboard", autenticarDashboard, (_req, res) => {
  res.sendFile(path.join(dashboardPath, "index.html"));
});

// Inicialização
(async () => {
  try {
    await initConfig();
    console.log("✅ Banco inicializado");

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao inicializar servidor:", err);
  }
})();
