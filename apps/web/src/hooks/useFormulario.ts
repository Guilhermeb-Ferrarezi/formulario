import { useState, useMemo } from "react";
import { validarEmail, validarCPF } from "../utils/validarFormulario";
import type { FormValues } from "../utils/validarFormulario";

// 🔥 URL vinda do ambiente (Vite)
const API_URL = import.meta.env.VITE_API_URL || "/api";
type Mensagem = {
  texto: string;
  tipo: "sucesso" | "erro";
} | null;

function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export function useFormulario() {
  const [mensagem, setMensagem] = useState<Mensagem>(null);
  const [values, setValues] = useState<FormValues>({
    nome: "",
    dataNascimento: "",
    whatsapp: "",
    email: "",
    cpf: "",
    responsavelNome: "",
    responsavelGrauParentesco: "",
    responsavelWhatsapp: "",
    responsavelCpf: "",
    responsavelEmail: "",
  });

  // Calcular se é menor de idade
  const ehMenorDeIdade = useMemo(() => {
    if (!values.dataNascimento) return false;
    return calcularIdade(values.dataNascimento) < 18;
  }, [values.dataNascimento]);

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

  // Validar campos básicos
  const camposBasicosValidos =
    values.nome.trim() !== "" &&
    values.dataNascimento.trim() !== "" &&
    values.whatsapp.trim() !== "" &&
    values.email.trim() !== "" &&
    values.cpf.trim() !== "";

  if (!camposBasicosValidos) {
    setMensagem({
      texto: "Por favor, preencha todos os campos obrigatórios.",
      tipo: "erro",
    });
    return;
  }

  // Validar formato de email
  if (!validarEmail(values.email)) {
    setMensagem({
      texto: "Por favor, insira um email válido.",
      tipo: "erro",
    });
    return;
  }

  // Validar formato de CPF
  if (!validarCPF(values.cpf)) {
    setMensagem({
      texto: "Por favor, insira um CPF válido (11 dígitos).",
      tipo: "erro",
    });
    return;
  }

  // Se menor de idade, validar responsável
  if (ehMenorDeIdade) {
    const responsavelValido =
      values.responsavelNome?.trim() !== "" &&
      values.responsavelGrauParentesco?.trim() !== "" &&
      values.responsavelWhatsapp?.trim() !== "" &&
      values.responsavelCpf?.trim() !== "" &&
      values.responsavelEmail?.trim() !== "";

    if (!responsavelValido) {
      setMensagem({
        texto: "Por favor, preencha todos os dados do responsável.",
        tipo: "erro",
      });
      return;
    }

    // Validar email do responsável
    if (!validarEmail(values.responsavelEmail!)) {
      setMensagem({
        texto: "Email do responsável inválido.",
        tipo: "erro",
      });
      return;
    }

    // Validar CPF do responsável
    if (!validarCPF(values.responsavelCpf!)) {
      setMensagem({
        texto: "CPF do responsável inválido (11 dígitos).",
        tipo: "erro",
      });
      return;
    }
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
