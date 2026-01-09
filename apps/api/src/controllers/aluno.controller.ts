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
  const { nome, dataNascimento, whatsapp, email, cpf } = req.body;

  // 1️⃣ Validação básica
  if (!nome || !dataNascimento || !whatsapp || !email || !cpf) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios"
    });
  }

  try {
    // 2️⃣ Verificações de duplicidade (mensagens específicas)
    if (await buscarAlunoPorEmail(email)) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    if (await buscarAlunoPorCPF(cpf)) {
      return res.status(409).json({ erro: "CPF já cadastrado" });
    }

    if (await buscarAlunoPorWhatsapp(whatsapp)) {
      return res.status(409).json({ erro: "WhatsApp já cadastrado" });
    }

    // 3️⃣ Normaliza data para o Postgres (DATE)
    const dataFormatada = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];

    // 4️⃣ Insert
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

    return res.status(201).json(rows[0]);

  } catch (error: any) {
    console.error("❌ Erro banco:", error);

    // 5️⃣ Tratamento de duplicidade do Postgres (fallback seguro)
    if (error.code === "23505") {
      if (error.constraint?.includes("cpf")) {
        return res.status(409).json({ erro: "CPF já cadastrado" });
      }
      if (error.constraint?.includes("email")) {
        return res.status(409).json({ erro: "Email já cadastrado" });
      }
      if (error.constraint?.includes("whatsapp")) {
        return res.status(409).json({ erro: "WhatsApp já cadastrado" });
      }

      return res.status(409).json({
        erro: "Aluno já cadastrado"
      });
    }

    return res.status(500).json({
      erro: "Erro interno ao salvar aluno"
    });
  }
}
