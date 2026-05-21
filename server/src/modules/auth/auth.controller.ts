import { Request, Response } from 'express';
import { registerService, loginService } from './auth.service';

// =========================
// REGISTER
// =========================
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    const result = await registerService(name, email, password, role);

    return res.json({
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Registration failed' });
  }
}

// =========================
// LOGIN
// =========================
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    return res.json({
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Login failed' });
  }
}
