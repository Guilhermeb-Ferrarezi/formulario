import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT // ou 80
const dashboardPath = path.resolve(process.cwd(), "dist"); // Vite build

// Verifica se o build existe
if (!fs.existsSync(dashboardPath)) {
  console.error("❌ React build não encontrado em:", dashboardPath);
  process.exit(1);
}

// Middleware de autenticação simples
function autenticarDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const senha = req.headers["x-dashboard-password"];
  if (senha === process.env.DASHBOARD_PASSWORD || senha === "minhasenha123") return next();
  res.status(401).send("❌ Senha incorreta");
}

// Servir arquivos estáticos (JS/CSS/Assets)
app.use("/dashboard/assets", express.static(path.join(dashboardPath, "assets")));

// Rota principal do dashboard
app.get("/dashboard", autenticarDashboard, (_req, res) => {
  res.sendFile(path.join(dashboardPath, "index.html"));
});

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
