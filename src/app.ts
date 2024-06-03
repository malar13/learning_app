import "reflect-metadata";
import express from 'express';
import { useExpressServer } from "routing-controllers";

import { AppDataSource } from './config/db';
import { CourseController } from "./controllers/courseController";
import { UserController } from "./controllers/userController";
import { EnrollmentController } from "./controllers/enrollmentController";
import { ScoreController } from "./controllers/scoreController";
import { ErrorHandlerMiddleware } from "./middlewars/errorHandler";

class Server {

  public app;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    useExpressServer(this.app, {
      controllers: [ UserController, CourseController, EnrollmentController, ScoreController ],
      middlewares: [ ErrorHandlerMiddleware ]
    });
  }

  public start() {
    const PORT = process.env.PORT || 1400;
    AppDataSource.initialize().then(() => {
      console.log('mongo server start');
      this.app.listen(PORT, () => {
        console.log(`Server started running on the port ${PORT}`);
      });
    }).catch((err) => {
      console.log(err);
    });
  }
}

const server = new Server();
server.start();