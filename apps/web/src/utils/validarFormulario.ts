export type FormValues = {
  nome: string;
  dataNascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
};

export function validarFormulario(values: FormValues): boolean {
  return (
    values.nome.trim() !== "" &&
    values.dataNascimento.trim() !== "" &&
    values.whatsapp.trim() !== "" &&
    values.email.trim() !== "" &&
    values.cpf.trim() !== ""
  );
}
