import { Router } from "express";
const router = Router();

const USER = "admin";
const PASS = "123456";

router.post("/login", (req, res) => {
  console.log("📥 Body recebido:", req.body);
  console.log("📥 Headers:", req.headers);
  
  const { username, password } = req.body;
  
  console.log("🔐 Tentativa de login:", { username, password });
  
  if (!username || !password) {
    console.log("❌ Campos faltando!");
    return res.status(400).json({ erro: "Username e password são obrigatórios" });
  }

  if (username === USER && password === PASS) {
    const token = "MEU_TOKEN_SECRETO";
    console.log("✅ Login bem-sucedido!");
    return res.json({ token });
  } else {
    console.log("❌ Credenciais inválidas");
    return res.status(401).json({ erro: "Usuário ou senha inválidos" });
  }
});

export default router;