import { Router } from "express";
import { pool } from "../config/pool";
import { verificarToken } from "../middlewares/verificarToken";

const router = Router();

/* ======================================================
   ROTA PÚBLICA — CADASTRAR ALUNO
====================================================== */
router.post("/public", async (req, res) => {
  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const dataFormatada = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];

    const result = await pool.query(
      `
      INSERT INTO alunos (nome, data_nascimento, whatsapp, email, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [nome, dataFormatada, whatsapp, email, cpf]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      if (error.constraint?.includes("cpf")) {
        return res.status(409).json({ erro: "CPF já cadastrado" });
      }
      if (error.constraint?.includes("email")) {
        return res.status(409).json({ erro: "Email já cadastrado" });
      }
      if (error.constraint?.includes("whatsapp")) {
        return res.status(409).json({ erro: "WhatsApp já cadastrado" });
      }

      return res.status(409).json({ erro: "Dados duplicados" });
    }

    console.error("❌ Erro banco:", error);
    return res.status(500).json({ erro: "Erro interno ao salvar aluno" });
  }
});

/* ======================================================
   ROTAS PROTEGIDAS
====================================================== */

// LISTAR TODOS OS ALUNOS
router.get("/", verificarToken, async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos ORDER BY id DESC");
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar alunos" });
  }
});

// BUSCAR ALUNO POR ID
router.get("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM alunos WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar aluno" });
  }
});

// ATUALIZAR ALUNO
router.put("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !data_nascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE alunos
      SET nome = $1,
          data_nascimento = $2,
          whatsapp = $3,
          email = $4,
          cpf = $5
      WHERE id = $6
      RETURNING *
      `,
      [nome, data_nascimento, whatsapp, email, cpf, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      if (error.constraint?.includes("cpf")) {
        return res.status(409).json({ erro: "CPF já cadastrado" });
      }
      if (error.constraint?.includes("email")) {
        return res.status(409).json({ erro: "Email já cadastrado" });
      }
      if (error.constraint?.includes("whatsapp")) {
        return res.status(409).json({ erro: "WhatsApp já cadastrado" });
      }

      return res.status(409).json({ erro: "Dados duplicados" });
    }

    console.error(error);
    return res.status(500).json({ erro: "Erro ao atualizar aluno" });
  }
});

// DELETAR ALUNO
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM alunos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json({ mensagem: "Aluno removido com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao deletar aluno" });
  }
});

export default router;
