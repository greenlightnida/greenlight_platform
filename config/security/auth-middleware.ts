// auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthService } from '../services/auth/google-auth-service';
import { GoogleAuditService } from '../services/auth/google-audit-service';

export interface AuthenticatedRequest extends Request {
  user?: { id?: string; email?: string; groups?: string[]; roles?: string[] };
  googleUser?: any;
  cookies: any;
}

export class AuthMiddleware {
  private googleAuth: GoogleAuthService;
  private auditService: GoogleAuditService;

  constructor() {
    this.googleAuth = new GoogleAuthService();
    this.auditService = new GoogleAuditService();
  }

  async authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        await this.logAuthEvent(req, 'no_token', false);
        res.status(401).json({ error: 'No authentication token provided' });
        return;
      }

      const googleUser = await this.googleAuth.authenticateUser(token);
      req.googleUser = googleUser;
      req.user = googleUser;

      await this.logAuthEvent(req, 'login_success', true);
      next();
    } catch (error) {
      await this.logAuthEvent(req, 'login_failed', false);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }

  async requireRole(roles: string[]): Promise<(req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>> {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.googleUser) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        const userRoles = req.googleUser.groups || [];
        const hasRequiredRole = roles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          await this.logAuthEvent(req, 'unauthorized_access', false);
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }

        await this.logAuthEvent(req, 'authorized_access', true);
        next();
      } catch (error) {
        await this.logAuthEvent(req, 'authorization_error', false);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  }

  private extractToken(req: AuthenticatedRequest): string | null {
    // Extract from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Extract from cookies
    const tokenCookie = req.cookies?.google_token;
    if (tokenCookie) {
      return tokenCookie;
    }

    return null;
  }

  private async logAuthEvent(req: AuthenticatedRequest, action: string, success: boolean): Promise<void> {
    await this.auditService.logAuthEvent({
      userId: req.user?.id || 'unknown',
      email: req.user?.email || 'unknown',
      action: action,
      platform: req.path,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      googleGroups: req.user?.groups || [],
      roles: req.user?.roles || [],
      success: success
    });
  }
}