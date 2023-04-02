import { z } from 'zod';
import { Role } from '@prisma/client';

const roleEnum = z.nativeEnum(Role);
type roleEnum = z.infer<typeof roleEnum>;

const register = z
  .object({
    name: z
      .string()
      .max(30)
      .nonempty({ message: 'Name must contain at least 1 character' }),
    email: z
      .string()
      .email({ message: 'Email must be a valid address' })
      .nonempty({ message: 'Email must contain at least 1 character' }),
    password: z
      .string()
      .min(6, { message: 'Password must contain at least 6 characters' })
      .nonempty({ message: 'Password must contain at least 1 character' }),
    role: roleEnum.optional().refine(
      val => {
        return val === 'USER' || val === 'ADMIN';
      },
      { message: 'Role is required' }
    )
  })
  .required({
    name: true,
    email: true,
    password: true,
    role: true
  });

const login = z
  .object({
    email: z
      .string()
      .email({ message: 'Email must be a valid address' })
      .nonempty({ message: 'Email must contain at least 1 character' }),
    password: z
      .string()
      .min(6, { message: 'Password must contain at least 6 characters' })
      .nonempty({ message: 'Password must contain at least 1 character' })
  })
  .required({
    email: true,
    password: true
  });

export default { register, login };
