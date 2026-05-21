import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * JWT Authentication Middleware
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
}

/**
 * Role-based access control middleware
 */
export function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          code: 'NO_USER'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Forbidden',
          code: 'INSUFFICIENT_ROLE'
        });
      }

      next();
    } catch (err) {
      return res.status(403).json({
        error: 'Forbidden',
        code: 'ROLE_CHECK_FAILED'
      });
    }
  };
}