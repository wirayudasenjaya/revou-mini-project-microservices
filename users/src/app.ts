import express from "express";
import "dotenv/config";
import morgan from 'morgan';

import { UserController } from "./controllers/user-controller";
import { UserService } from "./services/user-service";
import { UserRepository } from "./repositories/user-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const database = await mysqlConnection();

    const userRepository = new UserRepository(database);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.use(express.json());
    app.use(morgan("dev"));

    const usersRouter = express.Router();
    usersRouter.post("/users/login", userController.login);
    usersRouter.post("/users/register", userController.register);

    app.use(usersRouter);
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
