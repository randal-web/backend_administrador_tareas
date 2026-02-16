import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { config } from '../../config';
import { User } from './user.model';

export class AuthService {
  private static generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  static async register(email: string, password: string, fullName: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const password_hash = await bcryptjs.hash(password, 12);
    const user = await User.create({
      email,
      password_hash,
      full_name: fullName,
      provider: 'local',
    });

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password_hash) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await bcryptjs.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  static async findOrCreateOAuthUser(profile: {
    email: string;
    fullName: string;
    avatarUrl?: string;
    provider: string;
    providerId: string;
  }) {
    let user = await User.findOne({ where: { email: profile.email } });

    if (!user) {
      user = await User.create({
        email: profile.email,
        full_name: profile.fullName,
        avatar_url: profile.avatarUrl || null,
        provider: profile.provider,
        provider_id: profile.providerId,
      });
    } else if (user.provider === 'local') {
      // Link existing local account with OAuth
      await user.update({
        provider: profile.provider,
        provider_id: profile.providerId,
        avatar_url: profile.avatarUrl || user.avatar_url,
      });
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcryptjs.hash(resetToken, 12);

    // Store reset token temporarily (would use Redis in production)
    // For now, we use JWT with short expiration
    const resetJwt = jwt.sign(
      { userId: user.id, resetToken: resetTokenHash },
      config.jwt.secret,
      { expiresIn: '1h' } as jwt.SignOptions
    );

    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetJwt}`;

    if (config.smtp.user && config.smtp.pass) {
      const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });

      await transporter.sendMail({
        from: config.smtp.user,
        to: email,
        subject: 'Recuperación de contraseña - Administrador de Tareas',
        html: `
          <h2>Recuperar contraseña</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Este enlace expira en 1 hora.</p>
        `,
      });
    }

    return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new Error('Token inválido');
      }

      const password_hash = await bcryptjs.hash(newPassword, 12);
      await user.update({ password_hash });

      return { message: 'Contraseña actualizada correctamente' };
    } catch {
      throw new Error('Token inválido o expirado');
    }
  }

  static async getProfile(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return this.sanitizeUser(user);
  }

  static async updateProfile(userId: string, data: { full_name?: string; avatar_url?: string }) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');
    await user.update(data);
    return this.sanitizeUser(user);
  }

  private static sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      provider: user.provider,
      created_at: user.created_at,
    };
  }
}
