import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { hashPassword, comparePassword, signToken } from '../../utils/jwt';

// =========================
// REGISTER
// =========================
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashed,
        role: role || 'customer',
      },
    });

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed' });
  }
}

// =========================
// LOGIN
// =========================
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
}
