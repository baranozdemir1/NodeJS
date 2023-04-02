import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

import Controller from '@/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import Logger from '@/helpers/logger';

class App {
  public express: Application;
  public port: number;
  public prisma: PrismaClient;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.prisma = new PrismaClient({
      log: ['error', 'info', 'warn']
    });

    this.consoleLine();
    this.initialiseMorgan();
    this.initaliseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private consoleLine(): void {
    console.log(
      '\x1b[36m--------------------------------------------\x1b[0m\n'
    );
  }

  private initialiseMorgan(): void {
    morgan.token('splitter', () => {
      return '\x1b[36m--------------------------------------------\x1b[0m\n';
    });

    morgan.token('statusColor', (req, res) => {
      const status = (
        typeof res.headersSent !== 'boolean'
          ? Boolean(res.getHeader)
          : res.headersSent
      )
        ? res.statusCode
        : undefined;

      const color =
        status! >= 500
          ? 31
          : status! >= 400
            ? 33
            : status! >= 300
              ? 36
              : status! >= 200
                ? 32
                : 0;

      return '\x1b[' + color + 'm' + status + '\x1b[0m';
    });

    morgan.token('getDate', () => {
      return new Date().toLocaleString();
    });

    this.express.use(
      morgan(
        `:splitter\x1b[95m[:getDate]\x1b[0m \x1b[33m[:method]\x1b[0m \x1b[36m:url\x1b[0m :statusColor :response-time ms`
      )
    );
  }

  private initaliseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  public async start(): Promise<void> {
    this.prisma
      .$connect()
      .then(() => {
        Logger.success('Connected to PostgreSQL.');
        this.express.listen(this.port, () => {
          Logger.info(`Server is running on port ${this.port}.`);
        });
      })
      .catch((err: any) => {
        Logger.error(`${err}`);
      });
  }
}

export default App;
