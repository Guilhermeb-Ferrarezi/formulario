import { Router } from "express";
import { pool } from "../config/pool";
import { verificarToken } from "../middlewares/verificarToken";
import { criarAlunoController } from "../controllers/aluno.controller";

const router = Router();

// ===== ROTA PÚBLICA - Cadastro de alunos (sem autenticação) =====
router.post("/public", criarAlunoController)

// ===== ROTAS PROTEGIDAS (requerem autenticação) =====

// POST /alunos → criar aluno (protegido)
router.post("/", verificarToken, criarAlunoController)


// GET /alunos → listar todos os alunos (protegido)
router.get("/", verificarToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao buscar alunos:", err);
    res.status(500).json({ erro: "Erro ao buscar alunos" });
  }
});

export default router;