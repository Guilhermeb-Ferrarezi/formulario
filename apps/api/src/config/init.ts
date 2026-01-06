import { pool } from "./pool";

export async function initConfig() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      data_nascimento DATE NOT NULL,
      whatsapp TEXT NOT NULL,
      email TEXT NOT NULL,
      cpf TEXT NOT NULL
    )
  `);
}
