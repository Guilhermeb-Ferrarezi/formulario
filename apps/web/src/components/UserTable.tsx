// web/src/components/AlunoTable.tsx
import type { Aluno } from "../hooks/useUsers";

type Props = {
  alunos: Aluno[];
};

export function AlunoTable({ alunos }: Props) {
  return (
    <table width="100%" cellPadding={10}>
      <thead>
        <tr>
          <th align="left">Nome</th>
          <th align="left">Email</th>
          <th align="left">WhatsApp</th>
          <th align="left">CPF</th>
          <th align="left">Nascimento</th>
        </tr>
      </thead>
      <tbody>
        {alunos.map(aluno => (
          <tr key={aluno.id}>
            <td>{aluno.nome}</td>
            <td>{aluno.email}</td>
            <td>{aluno.whatsapp}</td>
            <td>{aluno.cpf}</td>
            <td>
              {new Date(aluno.dataNascimento).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
