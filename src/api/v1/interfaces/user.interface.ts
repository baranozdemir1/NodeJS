// import { Document } from 'mongoose';

enum Role {
  USER,
  ADMIN
}

export default interface User {
  id: number;
  createdAt: Date;
  email: string;
  name: string;
  password: string;
  role: Role;

  //isValidPassword(password: string): Promise<Error | boolean>;
}
