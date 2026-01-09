import { useState } from "react";
import { validarFormulario } from "../utils/validarFormulario";
import type { FormValues } from "../utils/validarFormulario";

// 🔥 URL vinda do ambiente (Vite)
const API_URL = import.meta.env.VITE_API_URL || "/api";

export function useFormulario() {
  const [mensagem, setMensagem] = useState("");
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

    if (!validarFormulario(values)) {
      setMensagem("Preencha todos os campos.");
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

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      setMensagem("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error(error);
      setMensagem("Erro: "); + (error instanceof Error ? error.message : "Erro desconhecido");
    }
  }

  return {
    values,
    mensagem,
    handleChange,
    handleSubmit,
  };
}