import { useState } from "react";
import { validarFormulario } from "../utils/validarFormulario";
import type { FormValues } from "../utils/validarFormulario";

// 🔥 URL vinda do ambiente (Vite)
const API_URL = import.meta.env.VITE_API_URL || "/api";
type Mensagem = {
  texto: string;
  tipo: "sucesso" | "erro";
} | null;



export function useFormulario() {
  const [mensagem, setMensagem] = useState<Mensagem>(null);
  const [values, setValues] = useState<FormValues>({
    nome: "",
    dataNascimento: "",
    whatsapp: "",
    email: "",
    cpf: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setMensagem(null);

  if (!validarFormulario(values)) {
    setMensagem({
      texto: "Por favor, preencha todos os campos corretamente.",
      tipo: "erro",
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/alunos/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    // ❌ erro vindo do backend
    if (!response.ok) {
      setMensagem({
        texto: data.erro || "Erro ao realizar cadastro",
        tipo: "erro",
      });
      return;
    }

    // ✅ sucesso
    setMensagem({
      texto: "Cadastro realizado com sucesso!",
      tipo: "sucesso",
    });

  } catch (error) {
    console.error(error);
    setMensagem({
      texto: "Erro de conexão com o servidor",
      tipo: "erro",
    });
  }
}


  return {
    values,
    mensagem,
    handleChange,
    handleSubmit,
  };
}
