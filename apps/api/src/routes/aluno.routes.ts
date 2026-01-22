import { Router } from "express";
import { pool } from "../config/pool";
import { verificarToken } from "../middlewares/verificarToken";
import {
  existeAlunoPorCPF,
  existeAlunoPorEmail,
  existeAlunoPorWhatsapp,
  existeResponsavelPorCPF,
  inserirResponsaveis,
  buscarResponsaveisPorAlunoId,
  deletarResponsaveisPorAlunoId
} from "../repositories/verificarAlunodb";

const router = Router();

/* ======================================================
   ROTA PÚBLICA — CADASTRAR ALUNO COM RESPONSÁVEIS
====================================================== */
router.post("/public", async (req, res) => {
  const {
    nome,
    data_nascimento,
    dataNascimento,
    whatsapp,
    email,
    cpf,
    responsaveis
  } = req.body;

  // Aceita tanto data_nascimento quanto dataNascimento
  const dataNasc = data_nascimento || dataNascimento;

  if (!nome || !dataNasc || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    // Verificar duplicidades de aluno
    if (await existeAlunoPorEmail(email)) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    if (await existeAlunoPorCPF(cpf)) {
      return res.status(409).json({ erro: "CPF já cadastrado" });
    }

    if (await existeAlunoPorWhatsapp(whatsapp)) {
      return res.status(409).json({ erro: "WhatsApp já cadastrado" });
    }

    // Verificar duplicidades de responsáveis
    if (responsaveis && Array.isArray(responsaveis) && responsaveis.length > 0) {
      for (const resp of responsaveis) {
        if (await existeResponsavelPorCPF(resp.cpf)) {
          return res.status(409).json({ erro: `CPF do responsável ${resp.nome} já cadastrado` });
        }
      }
    }

    const dataFormatada = new Date(dataNasc)
      .toISOString()
      .split("T")[0];

    // 1. Inserir aluno
    const resultAluno = await pool.query(
      `
      INSERT INTO alunos (nome, data_nascimento, whatsapp, email, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, data_nascimento, whatsapp, email, cpf, created_at, updated_at
      `,
      [nome, dataFormatada, whatsapp, email, cpf]
    );

    const alunoId = resultAluno.rows[0].id;

    // 2. Inserir responsáveis se existirem
    if (responsaveis && Array.isArray(responsaveis) && responsaveis.length > 0) {
      await inserirResponsaveis(alunoId, responsaveis);
    }

    // 3. Buscar aluno com responsáveis
    const alunoComResponsaveis = {
      ...resultAluno.rows[0],
      responsaveis: responsaveis || []
    };

    return res.status(201).json({
      mensagem: "Aluno cadastrado com sucesso!",
      tipo: "sucesso",
      data: alunoComResponsaveis
    });

  } catch (error: any) {
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

      return res.status(409).json({ erro: "Dados duplicados" });
    }

    console.error("❌ Erro banco:", error);
    return res.status(500).json({ erro: "Erro interno ao salvar aluno" });
  }
});

/* ======================================================
   ROTAS PROTEGIDAS
====================================================== */

// LISTAR TODOS OS ALUNOS COM SEUS RESPONSÁVEIS
router.get("/", verificarToken, async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos ORDER BY id DESC");

    // Buscar responsáveis para cada aluno
    const alunosComResponsaveis = await Promise.all(
      result.rows.map(async (aluno) => {
        const responsaveis = await buscarResponsaveisPorAlunoId(aluno.id);
        return {
          ...aluno,
          responsaveis
        };
      })
    );

    return res.json(alunosComResponsaveis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar alunos" });
  }
});

// BUSCAR ALUNO POR ID COM SEUS RESPONSÁVEIS
router.get("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM alunos WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const aluno = result.rows[0];
    const responsaveis = await buscarResponsaveisPorAlunoId(aluno.id);

    return res.json({
      ...aluno,
      responsaveis
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar aluno" });
  }
});

// ATUALIZAR ALUNO E SEUS RESPONSÁVEIS
router.put("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    data_nascimento,
    dataNascimento,
    whatsapp,
    email,
    cpf,
    responsaveis
  } = req.body;

  // Aceita tanto data_nascimento quanto dataNascimento
  const dataNasc = data_nascimento || dataNascimento;

  if (!nome || !dataNasc || !whatsapp || !email || !cpf) {
    return res.status(400).json({ erro: "Dados obrigatórios faltando" });
  }

  try {
    const dataFormatada = new Date(dataNasc)
      .toISOString()
      .split("T")[0];

    // Atualizar aluno
    const result = await pool.query(
      `
      UPDATE alunos
      SET nome = $1,
          data_nascimento = $2,
          whatsapp = $3,
          email = $4,
          cpf = $5,
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
      `,
      [nome, dataFormatada, whatsapp, email, cpf, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    // Atualizar responsáveis se fornecidos
    if (responsaveis && Array.isArray(responsaveis)) {
      await deletarResponsaveisPorAlunoId(parseInt(id));
      if (responsaveis.length > 0) {
        await inserirResponsaveis(parseInt(id), responsaveis);
      }
    }

    // Buscar aluno atualizado com responsáveis
    const alunoAtualizado = result.rows[0];
    const responsaveisAtualizados = await buscarResponsaveisPorAlunoId(parseInt(id));

    return res.json({
      ...alunoAtualizado,
      responsaveis: responsaveisAtualizados
    });
  } catch (error: any) {
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

      return res.status(409).json({ erro: "Dados duplicados" });
    }

    console.error(error);
    return res.status(500).json({ erro: "Erro ao atualizar aluno" });
  }
});

// DELETAR ALUNO E SEUS RESPONSÁVEIS
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Deletar responsáveis (CASCADE já faz, mas deixamos explícito)
    await deletarResponsaveisPorAlunoId(parseInt(id));

    // Deletar aluno
    const result = await pool.query(
      "DELETE FROM alunos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    return res.json({ mensagem: "Aluno e seus responsáveis removidos com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao deletar aluno" });
  }
});

export default router;
