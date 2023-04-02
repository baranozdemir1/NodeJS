import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/helpers/validateEnv';
// import DemoController from '@/controllers/demo.controller';
import UserController from '@/controllers/user.controller';

import { PrismaClient } from '@prisma/client';
import Logger from './helpers/logger';

validateEnv();

export const app = new App([new UserController()], Number(process.env.PORT));

new PrismaClient().user.findMany().then(data => Logger.success(data));

app.start();
