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
    setMensagem("");

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

      const data = await response.json();

      // ❌ Erro vindo do backend (CPF, email, whatsapp duplicado, etc)
      if (!response.ok) {
        setMensagem(data.erro || "Erro ao realizar cadastro");
        return;
      }

      // ✅ Sucesso
      setMensagem("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error(error);
      setMensagem("Erro de conexão com o servidor");
    }
  }

  return {
    values,
    mensagem,
    handleChange,
    handleSubmit,
  };
}
