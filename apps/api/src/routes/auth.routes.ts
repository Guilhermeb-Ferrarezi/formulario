import { Router } from "express";

const router = Router();

// Usuário e senha fixos (exemplo simples)
const USER = "admin";
const PASS = "123456";

// POST /auth/login → retorna token se credenciais corretas
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER && password === PASS) {
    const token = "MEU_TOKEN_SECRETO"; // token simples
    return res.json({ token });
  } else {
    return res.status(401).json({ erro: "Usuário ou senha inválidos" });
  }
});

export default router;
