import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../modules/admin/audit-log.model';

export async function auditMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const originalSend = res.send;

  // Intercept response to log only if successful
  res.send = function(body: any): Response {
    // Get user AFTER the route has been processed (so authMiddleware has run)
    const user = (req as any).user;

    if (user && res.statusCode >= 200 && res.statusCode < 300) {
      const { method, originalUrl, ip, headers } = req;
      
      // We only care about mutations for full auditing
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        let action = `${method} ${originalUrl}`;
        let module = 'OTHER';

        // Simplify action/module names based on URL
        if (originalUrl.includes('/tasks')) { module = 'TASKS'; action = method === 'POST' ? 'CREATE_TASK' : method === 'DELETE' ? 'DELETE_TASK' : 'UPDATE_TASK'; }
        else if (originalUrl.includes('/projects')) { module = 'PROJECTS'; action = method === 'POST' ? 'CREATE_PROJECT' : method === 'DELETE' ? 'DELETE_PROJECT' : 'UPDATE_PROJECT'; }
        else if (originalUrl.includes('/habits')) { module = 'HABITS'; action = method === 'POST' ? 'CREATE_HABIT' : 'LOG_HABIT'; }
        else if (originalUrl.includes('/auth')) { module = 'AUTH'; action = 'AUTH_ACTION'; }
        else if (originalUrl.includes('/admin')) { module = 'ADMIN'; action = 'ADMIN_ACTION'; }

        // Store log
        AuditLog.create({
          user_id: user.id,
          action: action,
          module: module,
          details: JSON.stringify({
            body: req.body,
            params: req.params,
            query: req.query,
            status: res.statusCode
          }),
          ip_address: ip,
          user_agent: headers['user-agent'] || null
        }).catch(err => console.error('Audit Log Error:', err));
      }
    }
    
    return originalSend.call(this, body);
  };

  next();
}
