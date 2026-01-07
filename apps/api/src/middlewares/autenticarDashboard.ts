import { Request, Response, NextFunction } from "express";

// Middleware para proteger o dashboard com Basic Auth
export function autenticarDashboard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Autenticação necessária");
  }

  // authHeader = "Basic base64(usuario:senha)"
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  // Usuário e senha do dashboard
  if (username === "admin" && password === "123456") {
    return next();
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Dashboard"');
    return res.status(401).send("Credenciais inválidas");
  }
}
