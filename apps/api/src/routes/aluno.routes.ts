import { Router } from "express";
import { criarAlunoController } from "../controllers/aluno.controller";4

const router = Router();

router.post("/alunos", criarAlunoController);
router.get("/", (req, res) => {
  res.send("API de Alunos funcionando!");
})

export default router;
