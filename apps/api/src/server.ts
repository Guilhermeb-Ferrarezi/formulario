import express from "express";
import cors from "cors";
import path from "path";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

const app = express();
const PORT = process.env.PORT || 80;

// =======================
// Configuração CORS
// =======================
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

// =======================
// Middleware de autenticação do dashboard
// =======================
function autenticarDashboard(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  // Basic Auth
  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Autenticação necessária");
  }

  // authHeader = "Basic base64(usuario:senha)"
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (username === "admin" && password === "123456") {
    return next();
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Credenciais inválidas");
  }
}

// =======================
// Rotas do dashboard
// =======================
const dashboardPath = path.join(__dirname, "frontend/dist");

app.use("/dashboard", autenticarDashboard, express.static(dashboardPath));
app.get("/dashboard/*", autenticarDashboard, (req, res) => {
  res.sendFile(path.join(dashboardPath, "index.html"));
});

// =======================
// Rotas da API protegidas
// =======================
app.use("/alunos", alunoRouter);

// =======================
// Inicialização do banco e servidor
// =======================
(async () => {
  try {
    await initConfig();
    console.log("✅ Tabela alunos pronta");

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
  }
})();
