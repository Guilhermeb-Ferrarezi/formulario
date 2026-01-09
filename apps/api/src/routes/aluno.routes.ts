import { Router } from "express";
import { pool } from "../config/pool";
import { verificarToken } from "../middlewares/verificarToken";
import { criarAlunoController } from "../controllers/aluno.controller";

const router = Router();

// ===== ROTA PÚBLICA - Cadastro de alunos (sem autenticação) =====
router.post("/public",  criarAlunoController)

// ===== ROTAS PROTEGIDAS (requerem autenticação) =====

// POST /alunos → criar aluno (protegido)
router.post("/", verificarToken, async (req, res) => {
  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome, data_nascimento, whatsapp, email, cpf)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, dataNascimento, whatsapp, email, cpf]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erro banco:", err);
    res.status(500).json({ erro: "Erro ao salvar aluno" });
  }
});

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