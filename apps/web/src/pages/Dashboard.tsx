// web/src/pages/Dashboard.tsx
import { useAlunos } from "../hooks/useUsers";
import { AlunoTable } from "../components/UserTable";

export default function Dashboard() {
  const { alunos, loading, error } = useAlunos();

  if (loading) return <p>Carregando alunos...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard de Alunos</h1>
      <AlunoTable alunos={alunos} />
    </main>
  );
}
