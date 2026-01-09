import type { Request, Response } from "express";
import { pool } from "../config/pool";

export async function deletarAlunoController(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM alunos WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json({ mensagem: "Aluno removido com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar aluno:", error);
    return res.status(500).json({ erro: "Erro interno ao deletar aluno" });
  }
}
