import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import alunoRouter from "./routes/aluno.routes";
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.resolve(__dirname, "../../web/dist");

// Verifica se o build existe
if (!fs.existsSync(frontendPath)) {
  console.error("❌ React build não encontrado em:", frontendPath);
  process.exit(1);
}

// Middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());


// ===== ROTAS DA API =====
app.use("/api/alunos", alunoRouter);
app.use("/api/auth", authRouter);

// ===== SERVIR REACT (PÚBLICO + DASHBOARD) =====
// Assets estáticos (CSS, JS, imagens)
app.use("/assets", express.static(path.join(frontendPath, "assets")));

// Rota SPA - serve index.html para TODAS as rotas do React
// Isso faz o React Router funcionar corretamente
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Inicialização
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📂 Servindo frontend de: ${frontendPath}`);
});