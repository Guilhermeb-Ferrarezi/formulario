import type { Request, Response } from "express";
import { pool } from "../config/pool";
import {
  buscarAlunoPorCPF,
  buscarAlunoPorEmail,
  buscarAlunoPorWhatsapp
} from "../repositories/verificarAlunodb";

export async function criarAlunoController(
  req: Request,
  res: Response
): Promise<Response> {
  console.log("POST recebido:", req.body);

  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  // 1️⃣ Validação básica (SEMPRE primeiro)
  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios"
    });
  }

  try {
    // 2️⃣ Verificações de duplicidade
    if (await buscarAlunoPorEmail(email)) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    if (await buscarAlunoPorCPF(cpf)) {
      return res.status(409).json({ erro: "CPF já cadastrado" });
    }

    if (await buscarAlunoPorWhatsapp(whatsapp)) {
      return res.status(409).json({ erro: "WhatsApp já cadastrado" });
    }

    // 3️⃣ Normaliza data (Postgres DATE)
    const dataFormatada = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];

    // 4️⃣ Inserção
    const { rows } = await pool.query(
      `
        INSERT INTO alunos
          (nome, data_nascimento, whatsapp, email, cpf)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [nome, dataFormatada, whatsapp, email, cpf]
    );

    console.log("✅ Aluno inserido:", rows[0]);
    return res.status(201).json(rows[0]);

  } catch (error: any) {
    console.error("❌ Erro banco:", error);

    // 5️⃣ Tratamento correto de erro de duplicidade do Postgres
    if (error.code === "23505") {
      return res.status(409).json({
        erro: "Aluno já cadastrado (dados duplicados)"
      });
    }

    return res.status(500).json({
      erro: "Erro interno ao salvar aluno"
    });
  }
}
