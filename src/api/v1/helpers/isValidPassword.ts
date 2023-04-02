import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

export default async function isValidPassword(
  email: string,
  password: string
): Promise<boolean | void> {
  const userPass = await new PrismaClient().user.findUnique({
    where: { email },
    select: { password: true }
  });

  if (!userPass) {
    throw 'User not found';
  }

  return await bcrypt.compare(password, userPass.password as string);
}
