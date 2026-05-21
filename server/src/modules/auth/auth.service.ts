import prisma from '../../config/prisma';
import { hashPassword, comparePassword, signToken } from '../../utils/jwt';

export async function registerService(name: string, email: string, password: string, role: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new Error('User already exists');

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

  return { user, token };
}

export async function loginService(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(password, user.passwordHash);

  if (!valid) throw new Error('Invalid credentials');

  const token = signToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  return { user, token };
}
