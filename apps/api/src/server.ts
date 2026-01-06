import express from "express";
import cors from "cors";
import alunoRoutes from "./routes/aluno.routes";
import { initConfig } from "./config/init";

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

app.use("/alunos", alunoRoutes);

// 🔥 inicializa banco ao subir
initConfig()
  .then(() => console.log("🚀 Configuração inicializada"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

try {app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}

export default app;
