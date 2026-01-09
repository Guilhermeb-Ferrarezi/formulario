import { Router } from "express";
import { verificarToken } from "../middlewares/verificarToken";
import { criarAlunoController } from "../controllers/aluno.controller";
import { pool } from "../config/pool";
import { deletarAlunoController } from "../controllers/deletarAluno.controller";
import { atualizarAlunoController } from "../controllers/atualizarAluno.controller";

// DELETE /alunos/:id



const router = Router();

/**
 * ================================
 * ROTA PÚBLICA
 * ================================
 * POST /alunos/public
 * Cadastro de aluno SEM autenticação
 * (usa o mesmo controller, logo mantém
 * mensagens de CPF/email/whatsapp duplicados)
 */
router.post("/public", criarAlunoController);

/**
 * ================================
 * ROTAS PROTEGIDAS
 * ================================
 */

// POST /alunos → criar aluno (com autenticação)
router.post("/", verificarToken, criarAlunoController);

// GET /alunos → listar todos os alunos (com autenticação)
router.get("/", verificarToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        nome,
        data_nascimento,
        whatsapp,
        email,
        cpf,
        created_at
      FROM alunos
      ORDER BY created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error("❌ Erro ao buscar alunos:", error);
    return res.status(500).json({
      erro: "Erro ao buscar alunos"
    });
  }
});

router.delete("/:id", verificarToken, deletarAlunoController);

// PUT /alunos/:id
router.put("/:id", verificarToken, atualizarAlunoController);

export default router;
