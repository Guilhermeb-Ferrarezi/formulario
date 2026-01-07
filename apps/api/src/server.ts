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
