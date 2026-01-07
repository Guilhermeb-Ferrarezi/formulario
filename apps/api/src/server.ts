import express from "express";
import cors from "cors";
import { initConfig } from "./config/init";
import alunoRouter from "./routes/aluno.routes";

const app = express();
const PORT = process.env.PORT || 80;

// CORS configurado para credenciais
const allowedOrigins = [
  "https://sga.santos-tech.com", // frontend
  "https://dashboard-bun.com"    // dashboard, se necessário
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("CORS não permitido"));
    }
  },
  credentials: true,              // ⚠️ permite cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/alunos", alunoRouter);

(async () => {
  try {
    await initConfig();
    console.log("✅ Tabela alunos pronta");

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
  }
})();

// Middleware para proteger dashboard
function autenticarDashboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Autenticação necessária");
  }

  // authHeader = "Basic base64(username:senha)"
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  // Aqui você define usuário e senha
  if (username === "admin" && password === "123456") {
    return next(); // autorizado
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Credenciais inválidas");
  }
}

// Usa o middleware só para a rota do dashboard
app.use("/dashboard", autenticarDashboard, express.static("dashboard_build"));
