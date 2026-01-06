import { useState } from "react";
import { validarFormulario } from "../utils/validarFormulario";
import type { FormValues } from "../utils/validarFormulario";

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

    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 🔴 valida antes de enviar
    if (!validarFormulario(values)) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    // ✅ AQUI entra o fetch
    const response = await fetch("http://localhost:3333/alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      setMensagem("Cadastro realizado com sucesso!");
    } else {
      setMensagem("Erro ao enviar os dados.");
    }
  }

  return {
    values,
    mensagem,
    handleChange,
    handleSubmit,
  };
}
