import type { Request, Response } from "express";
import { pool } from "../config/pool";

export async function criarAlunoController(req: Request, res: Response) {
  console.log("POST recebido:", req.body);

  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  // Converte a data para YYYY-MM-DD
  const dataFormatada = new Date(dataNascimento).toISOString().split("T")[0];

  try {
    const result = await pool.query(
      `
      INSERT INTO alunos
      (nome, data_nascimento, whatsapp, email, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [nome, dataFormatada, whatsapp, email, cpf]
    );

    console.log("Aluno inserido:", result.rows[0]);
    return res.status(201).json(result.rows[0]);
  } catch (erro) {
    console.error("❌ Erro banco:", erro);
    return res.status(500).json({ erro: "Erro ao salvar aluno" });
  }
}
