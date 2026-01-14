import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Aluno {
  id: number;
  nome: string;
  data_nascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
}

export default function EditarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [mensagem, setMensagem] = useState<{
  texto: string;
  tipo: "sucesso" | "erro";
    } | null>(null);

  const [carregando, setCarregando] = useState(true);

  // ======================
  // BUSCAR ALUNO PELO ID
  // ======================
  useEffect(() => {
    buscarAluno();
  }, []);

  const buscarAluno = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setMensagem({
            texto: "Erro ao buscar dados do aluno",
            tipo: "erro",
        })
        return;
      }

      const data = await response.json();
      setAluno(data);
    } catch (error) {
      console.error(error);
      setMensagem({
        texto: "Erro ao conectar com o servidor",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  // ======================
  // ATUALIZAR CAMPOS
  // ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!aluno) return;

    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  // ======================
  // SALVAR ALTERAÇÕES
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(aluno),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.erro || "Erro ao atualizar aluno");
        return;
      }

      alert("Aluno atualizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMensagem({
        texto: "Erro ao conectar com o servidor",
        tipo: "erro",
      });
    }
  };

  if (carregando) return <p>Carregando...</p>;
  if (!aluno) return <p>Aluno não encontrado</p>;

  return (
    <div className="form-container">
      <h1>✏️ Editar Aluno</h1>

      {mensagem && (
        <p
    className={
      mensagem.tipo === "erro"
        ? "form-message erro"
        : "form-message sucesso"
    }
    >
      {mensagem.texto}
    </p>
        )}

      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          value={aluno.nome}
          onChange={handleChange}
          placeholder="Nome"
        />

        <input
          type="date"
          name="data_nascimento"
          value={aluno.data_nascimento.split("T")[0]}
          onChange={handleChange}
        />

        <input
          name="whatsapp"
          value={aluno.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp"
        />

        <input
          name="email"
          value={aluno.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="cpf"
          value={aluno.cpf}
          onChange={handleChange}
          placeholder="CPF"
        />

        <button type="submit" className="botao-salvar">Salvar alterações</button>
        <button type="button" className="botao-cancelar" onClick={() => navigate("/dashboard")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
