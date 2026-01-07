// aluno.routes.ts
import { Router } from "express";
import { criarAlunoController } from "../controllers/aluno.controller";
import { pool } from "../config/pool";

const router = Router();

// POST /alunos
router.post("/", criarAlunoController);

// GET /alunos → lista todos os alunos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao buscar alunos:", err);
    res.status(500).json({ erro: "Erro ao buscar alunos" });
  }
});

export default router;
