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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, responsaveisData?: any) {
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

  // Se menor de idade, validar responsáveis
  if (ehMenorDeIdade && responsaveisData && Array.isArray(responsaveisData)) {
    if (responsaveisData.length === 0) {
      setMensagem({
        texto: "Por favor, adicione pelo menos um responsável.",
        tipo: "erro",
      });
      return;
    }

    for (const resp of responsaveisData) {
      if (!resp.nome?.trim() || !resp.grauParentesco?.trim() || !resp.whatsapp?.trim() || !resp.cpf?.trim() || !resp.email?.trim()) {
        setMensagem({
          texto: "Por favor, preencha todos os dados de todos os responsáveis.",
          tipo: "erro",
        });
        return;
      }

      if (!validarEmail(resp.email)) {
        setMensagem({
          texto: `Email do responsável ${resp.nome} inválido.`,
          tipo: "erro",
        });
        return;
      }

      if (!validarCPF(resp.cpf)) {
        setMensagem({
          texto: `CPF do responsável ${resp.nome} inválido (11 dígitos).`,
          tipo: "erro",
        });
        return;
      }
    }
  }

  try {
    const payload = {
      nome: values.nome,
      data_nascimento: values.dataNascimento,
      whatsapp: values.whatsapp,
      email: values.email,
      cpf: values.cpf,
      responsaveis: responsaveisData || [],
    };

    const response = await fetch(`${API_URL}/alunos/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
      texto: data.mensagem || "Cadastro realizado com sucesso!",
      tipo: "sucesso",
    });

    // Limpar formulário após sucesso
    setValues({
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
