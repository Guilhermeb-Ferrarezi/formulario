import { pool } from "../config/pool";

export async function buscarAlunoPorEmail(email: string) {
  const { rows } = await pool.query(
    "SELECT * FROM alunos WHERE email = $1 LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

export async function buscarAlunoPorCPF(cpf: string) {
  const { rows } = await pool.query(
    "SELECT * FROM alunos WHERE cpf = $1 LIMIT 1",
    [cpf]
  );

  return rows[0] || null;
}

export async function buscarAlunoPorWhatsapp(whatsapp: string) {
  const { rows } = await pool.query(
    "SELECT * FROM alunos WHERE whatsapp = $1 LIMIT 1",
    [whatsapp]
  );

  return rows[0] || null;
}