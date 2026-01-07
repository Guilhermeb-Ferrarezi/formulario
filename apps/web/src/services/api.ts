const API_URL = import.meta.env.VITE_API_URL;
import type { Aluno } from "../hooks/useUsers";

export async function criarAluno(dados: {
  nome: string;
  dataNascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
}) {
  const response = await fetch(`${API_URL}/alunos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar dados");
  }

  return response.json();
}

/* =========================
   LISTAR ALUNOS (DASHBOARD)
   ========================= */
export async function listarAlunos(): Promise<Aluno[]> {
  const response = await fetch(`${API_URL}/alunos`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado");
    }
    throw new Error("Erro ao buscar alunos");
  }

  return response.json();
}
