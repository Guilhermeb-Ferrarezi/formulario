export type FormValues = {
  nome: string;
  dataNascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
  // Dados do responsável (se menor de idade)
  responsavelNome?: string;
  responsavelGrauParentesco?: string;
  responsavelWhatsapp?: string;
  responsavelCpf?: string;
  responsavelEmail?: string;
};

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

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validarCPF(cpf: string): boolean {
  // Remove pontos e traços
  const cpfLimpo = cpf.replace(/[.\-]/g, '');

  // Verifica se tem 11 dígitos
  const regex = /^\d{11}$/;
  return regex.test(cpfLimpo);
}

export function validarFormulario(values: FormValues): boolean {
  const camposBasicosValidos =
    values.nome.trim() !== "" &&
    values.dataNascimento.trim() !== "" &&
    values.whatsapp.trim() !== "" &&
    values.email.trim() !== "" &&
    values.cpf.trim() !== "";

  if (!camposBasicosValidos) return false;

  // Validar formato de email
  if (!validarEmail(values.email)) return false;

  // Validar formato de CPF
  if (!validarCPF(values.cpf)) return false;

  // Se for menor de 18 anos, validar campos do responsável
  const idade = calcularIdade(values.dataNascimento);
  if (idade < 18) {
    const responsavelValido =
      values.responsavelNome?.trim() !== "" &&
      values.responsavelGrauParentesco?.trim() !== "" &&
      values.responsavelWhatsapp?.trim() !== "" &&
      values.responsavelCpf?.trim() !== "" &&
      values.responsavelEmail?.trim() !== "";

    if (!responsavelValido) return false;

    // Validar formato de email e CPF do responsável
    if (!validarEmail(values.responsavelEmail!)) return false;
    if (!validarCPF(values.responsavelCpf!)) return false;
  }

  return true;
}
