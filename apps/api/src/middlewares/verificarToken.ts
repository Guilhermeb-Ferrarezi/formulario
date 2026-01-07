import { Request, Response, NextFunction } from "express";

// Middleware para proteger rotas com token
export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer TOKEN

  if (token === "MEU_TOKEN_SECRETO") {
    return next();
  } else {
    return res.status(401).json({ erro: "Não autorizado" });
  }
}
