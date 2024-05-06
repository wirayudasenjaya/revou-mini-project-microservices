import express from "express";
import "dotenv/config";

import { OrderController } from "./controllers/order-controller";
import { OrderService } from "./services/order-service";
import { OrderRepository } from "./repositories/order-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const db = await mysqlConnection();

    const orderRepository = new OrderRepository(db);
    const orderService = new OrderService(orderRepository);
    const orderController = new OrderController(orderService);

    app.use(express.json());

    const orderRouter = express.Router();
    orderRouter.get("/order", orderController.getAll);
    orderRouter.post("/order", orderController.create);

    app.use(orderRouter);
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
