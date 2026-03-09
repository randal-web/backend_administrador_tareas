import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../modules/admin/audit-log.model';

export async function auditMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const originalSend = res.send;

  res.send = function(body: any): Response {
    const user = (req as any).user;

    if (user && res.statusCode >= 200 && res.statusCode < 300) {
      const { method, originalUrl, headers } = req;
      
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        let action = `${method} ${originalUrl}`;
        let module = 'OTHER';

        if (originalUrl.includes('/tasks')) { module = 'TASKS'; action = method === 'POST' ? 'CREATE_TASK' : method === 'DELETE' ? 'DELETE_TASK' : 'UPDATE_TASK'; }
        else if (originalUrl.includes('/projects')) { module = 'PROJECTS'; action = method === 'POST' ? 'CREATE_PROJECT' : method === 'DELETE' ? 'DELETE_PROJECT' : 'UPDATE_PROJECT'; }
        else if (originalUrl.includes('/habits')) { module = 'HABITS'; action = method === 'POST' ? 'CREATE_HABIT' : 'LOG_HABIT'; }
        else if (originalUrl.includes('/auth')) { module = 'AUTH'; action = 'AUTH_ACTION'; }
        else if (originalUrl.includes('/admin')) { module = 'ADMIN'; action = 'ADMIN_ACTION'; }

        // --- SECURITY: REDACT SENSITIVE DATA ---
        const sanitizedBody = { ...req.body };
        const sensitiveFields = ['password', 'token', 'oldPassword', 'newPassword', 'password_hash', 'current_password'];
        
        sensitiveFields.forEach(field => {
          if (sanitizedBody[field]) sanitizedBody[field] = '[REDACTED]';
        });

        // Don't log full body for Auth module to be extra safe
        const logDetails = module === 'AUTH' 
          ? { status: res.statusCode, info: 'Sensitive auth operation' }
          : { body: sanitizedBody, params: req.params, query: req.query, status: res.statusCode };

        AuditLog.create({
          user_id: user.id,
          action: action,
          module: module,
          details: JSON.stringify(logDetails),
          ip_address: null, // Removed as requested
          user_agent: headers['user-agent'] || null
        }).catch(err => console.error('Audit Log Error:', err));
      }
    }
    
    return originalSend.call(this, body);
  };

  next();
}
