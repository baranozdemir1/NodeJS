import type { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

import token from '@/helpers/token';
import { PrismaClient } from '@prisma/client';
import isValidPassword from '@/helpers/isValidPassword';

class UserService {
  private user = new PrismaClient().user;

  /**
   * Register a new user
   */
  public async register(
    name: string,
    email: string,
    password: string,
    role: Role
  ): Promise<string | Error> {
    try {
      const hasUser = await this.user.findUnique({
        where: {
          email
        }
      });

      if (!hasUser) {
        const hashPass = await bcrypt.hash(password, 10);

        const user = await this.user.create({
          data: {
            name,
            email,
            password: hashPass,
            role
          }
        });
        const accessToken = token.createToken(user);

        return accessToken;
      } else {
        throw 'Email already exist.';
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
  /**
   * Attempt to login a user
   */
  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findUnique({ where: { email } });

      if (!user) throw new Error('User not found.');

      if (await isValidPassword(email, password)) {
        return token.createToken(user);
      } else {
        throw new Error('Wrong credentials given.');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default UserService;
