import express from "express";
import "dotenv/config";

import { NotificationService } from "./services/notification-service";
import { NotificationRepository } from "./repositories/notification-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const database = await mysqlConnection();

    const notificationRepository = new NotificationRepository(database);
    const notificationService = new NotificationService(notificationRepository);

    notificationService.createNotification();
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
