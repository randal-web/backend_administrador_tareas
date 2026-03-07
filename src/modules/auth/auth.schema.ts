import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'El token es requerido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    avatar_url: z.string().url('URL de avatar inválida').optional().nullable(),
  }),
});
