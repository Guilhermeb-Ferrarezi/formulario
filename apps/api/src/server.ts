import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

// =======================
// Middleware de autenticação do dashboard
// =======================
function autenticarDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Exemplo simples: usa header "x-dashboard-password"
  const senha = req.headers["x-dashboard-password"];
  const SENHA_CORRETA = process.env.DASHBOARD_PASSWORD || "minhasenha123";

  if (senha === SENHA_CORRETA) {
    return next();
  } else {
    return res.status(401).send("❌ Senha incorreta para acessar o dashboard");
  }
}

const app = express();
const PORT = process.env.PORT || 80;
const dashboardPath = path.resolve(__dirname, "../web/dist");

// =======================
// CORS e JSON
// =======================
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

// =======================
// API de alunos
// =======================
app.use("/alunos", alunoRouter);

// =======================
// Servir arquivos estáticos do React build
// =======================
app.use("/dashboard", autenticarDashboard, express.static(dashboardPath));

// =======================
// Fallback do React Router
// =======================
app.get("/dashboard/*", autenticarDashboard, (req, res) => {
  // Verifica se o arquivo solicitado existe
  const requestedPath = path.join(dashboardPath, req.params[0] || "");
  if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    return res.sendFile(requestedPath);
  }
  // Caso contrário, retorna o index.html para o React Router
  res.sendFile(path.join(dashboardPath, "index.html"));
});

// =======================
// Inicialização do servidor
// =======================
(async () => {
  try {
    await initConfig();
    console.log("✅ Banco inicializado");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erro ao inicializar servidor:", err);
  }
})();
