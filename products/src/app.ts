import express from "express";
import "dotenv/config";

import { ProductController } from "./controllers/product-controller";
import { ProductService } from "./services/product-service";
import { ProductRepository } from "./repositories/product-repository";
import { mysqlConnection } from "./lib/database";

const app = express();

async function startServer() {
  try {
    const db = await mysqlConnection();

    const productRepository = new ProductRepository(db);
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);

    app.use(express.json());

    const productRouter = express.Router();
    productRouter.get("/product", productController.getAll);
    productRouter.get("/product/:product_id", productController.getOne);
    productRouter.post("/product/add", productController.add);
    productRouter.delete("/product/:product_id", productController.delete);

    app.use(productRouter);
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
