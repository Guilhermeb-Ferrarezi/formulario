import { pool } from "./pool";

export async function initConfig(): Promise<void> {
  // Criar tabela alunos
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

  // Criar tabela responsaveis
  await pool.query(`
    CREATE TABLE IF NOT EXISTS responsaveis (
      id SERIAL PRIMARY KEY,
      aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      grau_parentesco TEXT NOT NULL,
      whatsapp VARCHAR(20),
      cpf VARCHAR(14) NOT NULL UNIQUE,
      email TEXT,
      rua TEXT,
      numero TEXT,
      bairro TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
