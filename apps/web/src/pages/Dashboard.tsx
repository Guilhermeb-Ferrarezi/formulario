import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"
import "../styles/app.css"

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

  // ======================
  // BUSCAR ALUNOS
  // ======================
  const buscarAlunos = async () => {
    setCarregando(true);
    setErro("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://api.santos-tech.com/api/alunos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setErro("Erro ao buscar alunos");
        return;
      }

      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error("❌ Erro ao buscar alunos:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  // ======================
  // DELETAR ALUNO
  // ======================
  const deletarAluno = async (id: number) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || "Erro ao deletar aluno");
        return;
      }

      alert("Aluno removido com sucesso!");
      buscarAlunos(); // 🔄 atualiza lista
    } catch (error) {
      console.error("❌ Erro ao deletar aluno:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  // ======================
  // EDITAR ALUNO (por enquanto)
  // ======================
  const editarAluno = (aluno: Aluno) => {
    navigate(`/alunos/editar/${aluno.id}`);
  };

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div className="Tudo">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>📊 Dashboard Administrativo</h1>
          <button onClick={handleLogout} className="botao-sair">
            Sair
          </button>
          <button className="botao-home" onClick={() => navigate("https://painel-adm.santos-tech.com/home")}>
            Voltar para o Home
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
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {alunos.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>
                        {new Date(aluno.data_nascimento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td>{aluno.whatsapp}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.cpf}</td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => editarAluno(aluno)}
                          className="botao-editar"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => deletarAluno(aluno.id)}
                          className="botao-excluir"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
