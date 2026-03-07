import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Error de validación',
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    } else {
      res.status(500).json({ message: 'Error interno durante la validación' });
    }
  }
};
