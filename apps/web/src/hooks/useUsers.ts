// web/src/hooks/useAlunos.ts
import { useEffect, useState } from "react";
import { listarAlunos} from "../services/api";
import type {Aluno } from "../../../api/src/models/aluno.model"

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarAlunos()
      .then(setAlunos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { alunos, loading, error };
}
