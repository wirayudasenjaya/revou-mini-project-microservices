import express from "express";
import "dotenv/config";
import morgan from 'morgan';
import { Kafka } from "kafkajs";

import { OrderController } from "./controllers/order-controller";
import { OrderService } from "./services/order-service";
import { OrderRepository } from "./repositories/order-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const database = await mysqlConnection();

    const orderRepository = new OrderRepository(database);
    const orderService = new OrderService(orderRepository);
    const orderController = new OrderController(orderService);

    app.use(express.json());
    app.use(morgan("dev"));

    const orderRouter = express.Router();
    orderRouter.get("/order", orderController.getAll);
    orderRouter.post("/order", orderController.create);

    orderService.processNewOrder();

    app.use(orderRouter);
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
