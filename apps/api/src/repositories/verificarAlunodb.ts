import { pool } from "../config/pool";

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
