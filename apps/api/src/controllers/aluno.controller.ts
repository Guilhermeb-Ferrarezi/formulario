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
      mensagem: "Todos os campos são obrigatórios",
      tipo: "erro"
    });
  }

  try {
    // 2️⃣ Verificações de duplicidade
    if (await buscarAlunoPorEmail(email)) {
      return res.status(409).json({
        mensagem: "Email já cadastrado",
        tipo: "erro"
      });
    }

    if (await buscarAlunoPorCPF(cpf)) {
      return res.status(409).json({
        mensagem: "CPF já cadastrado",
        tipo: "erro"
      });
    }

    if (await buscarAlunoPorWhatsapp(whatsapp)) {
      return res.status(409).json({
        mensagem: "WhatsApp já cadastrado",
        tipo: "erro"
      });
    }

    // 3️⃣ Normaliza data
    const dataFormatada = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];

    // 4️⃣ Insert
    await pool.query(
      `
      INSERT INTO alunos
        (nome, data_nascimento, whatsapp, email, cpf)
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [nome, dataFormatada, whatsapp, email, cpf]
    );

    return res.status(201).json({
      mensagem: "Aluno cadastrado com sucesso!",
      tipo: "sucesso"
    });

  } catch (error: any) {
    console.error("❌ Erro banco:", error);

    // 5️⃣ Fallback de duplicidade
    if (error.code === "23505") {
      if (error.constraint?.includes("cpf")) {
        return res.status(409).json({
          mensagem: "CPF já cadastrado",
          tipo: "erro"
        });
      }
      if (error.constraint?.includes("email")) {
        return res.status(409).json({
          mensagem: "Email já cadastrado",
          tipo: "erro"
        });
      }
      if (error.constraint?.includes("whatsapp")) {
        return res.status(409).json({
          mensagem: "WhatsApp já cadastrado",
          tipo: "erro"
        });
      }

      return res.status(409).json({
        mensagem: "Aluno já cadastrado",
        tipo: "erro"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao salvar aluno",
      tipo: "erro"
    });
  }
}
