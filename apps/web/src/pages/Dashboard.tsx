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
  responsavel_nome?: string;
  responsavel_grau_parentesco?: string;
  responsavel_whatsapp?: string;
  responsavel_cpf?: string;
  responsavel_email?: string;
}

export default function Dashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    buscarAlunos();
  }, []);

  // ======================
  // CÁLCULO DE PAGINAÇÃO
  // ======================
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const alunosAtuais = alunos.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(alunos.length / itensPorPagina);

  const mudarPagina = (numeroPagina: number) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mudarItensPorPagina = (quantidade: number) => {
    setItensPorPagina(quantidade);
    setPaginaAtual(1);
  };

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
          <h1>Dashboard Jovem Tech RP</h1>
          <div>
            <button className="botao-home" onClick={() => navigate("/")}>
              🏠 Home
            </button>
            <button onClick={handleLogout} className="botao-sair">
              🚪 Sair
            </button>
          </div>
        </header>

        {carregando && <p>Carregando...</p>}
        {erro && <p className="erro-dashboard">{erro}</p>}

        {!carregando && !erro && (
          <>
            <div className="dashboard-stats">
              <h2>Total de alunos: {alunos.length}</h2>
              <div className="pagination-control">
                <label>Itens por página:</label>
                <select
                  value={itensPorPagina}
                  onChange={(e) => mudarItensPorPagina(Number(e.target.value))}
                  className="items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

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
                    <th>Responsável</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {alunosAtuais.map((aluno) => (
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
                      <td>
                        {aluno.responsavel_nome ? (
                          <div style={{ fontSize: "0.85rem" }}>
                            <strong>{aluno.responsavel_nome}</strong>
                            <br />
                            {aluno.responsavel_grau_parentesco && (
                              <>({aluno.responsavel_grau_parentesco})<br /></>
                            )}
                            {aluno.responsavel_whatsapp}
                          </div>
                        ) : (
                          <span style={{ color: "#999" }}>-</span>
                        )}
                      </td>
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

            {/* Controles de paginação */}
            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                >
                  ← Anterior
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;

                    // Mostrar apenas páginas próximas à atual
                    if (
                      numeroPagina === 1 ||
                      numeroPagina === totalPaginas ||
                      (numeroPagina >= paginaAtual - 1 && numeroPagina <= paginaAtual + 1)
                    ) {
                      return (
                        <button
                          key={numeroPagina}
                          className={`pagination-number ${paginaAtual === numeroPagina ? 'active' : ''}`}
                          onClick={() => mudarPagina(numeroPagina)}
                        >
                          {numeroPagina}
                        </button>
                      );
                    } else if (
                      numeroPagina === paginaAtual - 2 ||
                      numeroPagina === paginaAtual + 2
                    ) {
                      return <span key={numeroPagina} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próximo →
                </button>
              </div>
            )}

            <div className="pagination-info">
              Mostrando {indexPrimeiro + 1} a {Math.min(indexUltimo, alunos.length)} de {alunos.length} alunos
            </div>
          </>
        )}
      </div>
    </div>
  );
}
