import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/helpers/validateEnv';
import UserController from '@/controllers/user.controller';
import IntegrationController from './controllers/integration.controller';
import { PrismaClient } from '@prisma/client';

validateEnv();

export const app = new App(
  [new UserController(), new IntegrationController()],
  Number(process.env.PORT)
);
new PrismaClient().integration
  .findMany()
  .then(data => console.log('integration', data));
new PrismaClient().hepsiburada
  .findMany()
  .then(data => console.log('hepsiburada', data));
new PrismaClient().user.findMany().then(data => console.log('user', data));

app.start();
