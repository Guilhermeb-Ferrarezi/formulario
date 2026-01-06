import { pool } from "./pool";

export async function initConfig() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        data_nascimento DATE NOT NULL,
        whatsapp VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Tabela 'alunos' pronta");
  } catch (error) {
    console.error("❌ Erro ao inicializar config/banco:", error);
    throw error;
  }
}
