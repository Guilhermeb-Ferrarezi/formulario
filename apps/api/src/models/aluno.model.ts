export type Responsavel = {
  nome: string;
  grauParentesco: string;
  whatsapp: string;
  cpf: string;
  email: string;
};

export type Aluno = {
  id: number;
  nome: string;
  data_nascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
  created_at?: string;
  updated_at?: string;
  responsaveis?: Responsavel[];
};