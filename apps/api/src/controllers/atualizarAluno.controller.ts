import type { Request, Response } from "express";
import { pool } from "../config/pool";

export async function atualizarAlunoController(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios"
    });
  }

  try {
    const dataFormatada = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];

    const { rows, rowCount } = await pool.query(
      `
      UPDATE alunos SET
        nome = $1,
        data_nascimento = $2,
        whatsapp = $3,
        email = $4,
        cpf = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
      `,
      [nome, dataFormatada, whatsapp, email, cpf, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json(rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        erro: "Dados duplicados (CPF, email ou WhatsApp)"
      });
    }

    console.error("❌ Erro ao atualizar aluno:", error);
    return res.status(500).json({
      erro: "Erro interno ao atualizar aluno"
    });
  }
}
