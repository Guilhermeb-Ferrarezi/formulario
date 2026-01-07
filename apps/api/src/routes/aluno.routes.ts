import { Router } from "express";
import { criarAlunoController } from "../controllers/aluno.controller";

const router = Router();

router.post("/alunos", criarAlunoController);

export default router;
