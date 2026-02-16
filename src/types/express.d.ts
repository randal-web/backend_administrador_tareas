/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User as UserModel } from '../modules/auth/user.model';

declare global {
  namespace Express {
    // Merge our User model into Express.User
    interface User extends UserModel {}
  }
}

export {};
