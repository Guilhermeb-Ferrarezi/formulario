import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

// Middleware simples de autenticação
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

// Rotas da API
app.use("/alunos", alunoRouter);

// Servir arquivos estáticos do React build
app.use("/dashboard/static", express.static(path.join(dashboardPath, "static")));

// Rota principal do dashboard (sem wildcard)
app.get("/dashboard", autenticarDashboard, (_req, res) => {
  res.sendFile(path.join(dashboardPath, "index.html"));
});
