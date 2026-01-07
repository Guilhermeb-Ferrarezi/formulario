import { Request, Response, NextFunction } from "express";

const TOKEN_VALIDO = "MEU_TOKEN_SECRETO"; // Mesmo token do auth.routes.ts

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  // Formato esperado: "Bearer MEU_TOKEN_SECRETO"
  const token = authHeader.replace("Bearer ", "");

  if (token !== TOKEN_VALIDO) {
    return res.status(401).json({ erro: "Token inválido" });
  }

  next();
}