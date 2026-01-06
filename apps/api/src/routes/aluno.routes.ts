import { Router } from "express";
import { pool } from "../config/pool";

const router = Router();
const result = await pool.query("SELECT NOW()");
console.log(result.rows);

router.post("/", async (req, res) => {
  try {
    const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

    // validação básica
    if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // INSERT no banco
    const result = await pool.query(
      `
      INSERT INTO alunos (nome, data_nascimento, whatsapp, email, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [nome, dataNascimento, whatsapp, email, cpf]
    );

    return res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("❌ Erro ao inserir aluno:", err);
    return res.status(500).json({ error: "Erro ao salvar no banco" });
  }
});

export default router;
