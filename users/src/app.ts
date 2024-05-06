import express from "express";
import "dotenv/config";

import { UserController } from "./controllers/user-controller";
import { UserService } from "./services/user-service";
import { UserRepository } from "./repositories/user-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const db = await mysqlConnection();

    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.use(express.json());

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
