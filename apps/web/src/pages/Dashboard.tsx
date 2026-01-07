import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Aluno {
  id: number;
  nome: string;
  data_nascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
}

export default function Dashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarAlunos();
  }, []);

  const buscarAlunos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/alunos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        setErro("Erro ao buscar alunos");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Dashboard Administrativo</h1>
        <button onClick={handleLogout} className="botao-sair">
          Sair
        </button>
      </header>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro-dashboard">{erro}</p>}

      {!carregando && !erro && (
        <>
          <h2>Total de alunos: {alunos.length}</h2>
          
          <div className="tabela-container">
            <table className="tabela-alunos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Data Nasc.</th>
                  <th>WhatsApp</th>
                  <th>Email</th>
                  <th>CPF</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{aluno.nome}</td>
                    <td>{new Date(aluno.data_nascimento).toLocaleDateString("pt-BR")}</td>
                    <td>{aluno.whatsapp}</td>
                    <td>{aluno.email}</td>
                    <td>{aluno.cpf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}