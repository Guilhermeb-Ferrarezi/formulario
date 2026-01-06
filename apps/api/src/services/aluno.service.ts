import { pool } from "../config/pool";
import type { Aluno } from "../models/aluno.model.ts";

export async function criarAluno(aluno: Aluno) {
  const { nome, dataNascimento, whatsapp, email, cpf } = aluno;

  await pool.query(
    `
    INSERT INTO alunos
    (nome, data_nascimento, whatsapp, email, cpf)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [nome, dataNascimento, whatsapp, email, cpf]
  );
}
