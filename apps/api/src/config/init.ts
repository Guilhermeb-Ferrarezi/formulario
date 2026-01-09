import { pool } from "./pool";

export async function initConfig(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id SERIAL PRIMARY KEY,

      nome TEXT NOT NULL,

      data_nascimento DATE NOT NULL,

      whatsapp VARCHAR(20) NOT NULL UNIQUE,

      email TEXT NOT NULL UNIQUE,

      cpf VARCHAR(14) NOT NULL UNIQUE,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
