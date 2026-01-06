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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (validarFormulario(values)) {
      setMensagem("Formulário válido. Enviando...");
      console.log(values);
    } else {
      setMensagem("Preencha todos os campos.");
    }
  }

  return {
    values,
    mensagem,
    handleChange,
    handleSubmit,
  };
}
