const API_URL = import.meta.env.VITE_API_URL;

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
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar dados");
  }

  return response.json();
}
