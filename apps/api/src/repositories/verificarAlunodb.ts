import { pool } from "../config/pool";
import type { Responsavel } from "../models/aluno.model";

/**
 * Verifica se já existe aluno com este email
 */
export async function existeAlunoPorEmail(email: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM alunos WHERE email = $1 LIMIT 1",
    [email]
  );

  return rowCount !== null && rowCount > 0;
}

/**
 * Verifica se já existe aluno com este CPF
 */
export async function existeAlunoPorCPF(cpf: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM alunos WHERE cpf = $1 LIMIT 1",
    [cpf]
  );

  return rowCount !== null && rowCount > 0;
}

/**
 * Verifica se já existe aluno com este WhatsApp
 */
export async function existeAlunoPorWhatsapp(
  whatsapp: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM alunos WHERE whatsapp = $1 LIMIT 1",
    [whatsapp]
  );

  return rowCount !== null && rowCount > 0;
}

/**
 * Verifica se já existe responsável com este CPF
 */
export async function existeResponsavelPorCPF(cpf: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM responsaveis WHERE cpf = $1 LIMIT 1",
    [cpf]
  );

  return rowCount !== null && rowCount > 0;
}

/**
 * Insere responsáveis para um aluno
 */
export async function inserirResponsaveis(
  alunoId: number,
  responsaveis: Responsavel[]
): Promise<void> {
  for (const resp of responsaveis) {
    await pool.query(
      `
      INSERT INTO responsaveis (aluno_id, nome, grau_parentesco, whatsapp, cpf, email)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [alunoId, resp.nome, resp.grauParentesco, resp.whatsapp, resp.cpf, resp.email]
    );
  }
}

/**
 * Busca todos os responsáveis de um aluno
 */
export async function buscarResponsaveisPorAlunoId(alunoId: number): Promise<Responsavel[]> {
  const result = await pool.query(
    `
    SELECT nome, grau_parentesco as "grauParentesco", whatsapp, cpf, email
    FROM responsaveis
    WHERE aluno_id = $1
    ORDER BY id ASC
    `,
    [alunoId]
  );

  return result.rows;
}

/**
 * Deleta todos os responsáveis de um aluno
 */
export async function deletarResponsaveisPorAlunoId(alunoId: number): Promise<void> {
  await pool.query(
    "DELETE FROM responsaveis WHERE aluno_id = $1",
    [alunoId]
  );
}
