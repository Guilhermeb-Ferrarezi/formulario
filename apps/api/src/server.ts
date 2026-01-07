import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import alunoRouter from "./routes/aluno.routes";
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Tenta múltiplos caminhos possíveis
const possiveisCaminhos = [
  path.resolve(process.cwd(), "web/dist"),      // EasyPanel/Produção
  path.resolve(process.cwd(), "../web/dist"),   // Local (rodando de api/)
  path.resolve(__dirname, "../../web/dist"),    // Alternativo
];

let frontendPath = "";
for (const caminho of possiveisCaminhos) {
  if (fs.existsSync(caminho)) {
    frontendPath = caminho;
    console.log(`✅ Build encontrado em: ${caminho}`);
    break;
  }
}

// Verifica se o build existe
if (!frontendPath || !fs.existsSync(frontendPath)) {
  console.error("❌ React build não encontrado!");
  console.error("Caminhos testados:");
  possiveisCaminhos.forEach(c => console.error(`  - ${c}`));
  console.error(`\nDiretório atual: ${process.cwd()}`);
  console.error(`__dirname: ${__dirname}`);
  process.exit(1);
}

// Middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

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