import type { Request, Response } from "express";
import { pool } from "../config/pool";

export async function criarAlunoController(req: Request, res: Response) {
  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    await pool.query(
      `
      INSERT INTO alunos
      (nome, data_nascimento, whatsapp, email, cpf)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [nome, dataNascimento, whatsapp, email, cpf]
    );

    return res.status(201).json({ mensagem: "Aluno criado com sucesso" });
  } catch (erro) {
    console.error("Erro banco:", erro);
    return res.status(500).json({ erro: "Erro ao salvar aluno" });
  }
}
