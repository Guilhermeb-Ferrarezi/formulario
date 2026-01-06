import express from "express";
import cors from "cors";
import alunoRoutes from "./routes/aluno.routes";
import { initConfig } from "./config/init";

const app = express();

// ✅ porta segura para produção
const PORT = Number(process.env.PORT) || 80;

app.use(cors({
  origin: [
    "https://sga.santos-tech.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/alunos", alunoRoutes);

// ✅ inicializa config ANTES de subir o servidor
async function startServer() {
  try {
    await initConfig();
    console.log("🚀 Configuração inicializada");

    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

startServer();

export default app;
