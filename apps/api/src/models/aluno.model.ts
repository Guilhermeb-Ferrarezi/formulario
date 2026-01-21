export type Aluno = {
  id: number,
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