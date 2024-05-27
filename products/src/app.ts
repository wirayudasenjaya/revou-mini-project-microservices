import express from "express";
import "dotenv/config";
import morgan from 'morgan';

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
    app.use(morgan("dev"));

    const productRouter = express.Router();
    productRouter.get("/product", productController.getAll);
    productRouter.get("/product/:product_id", productController.getOne);
    productRouter.post("/product/add", productController.add);
    productRouter.patch("/product/:product_id", productController.edit);
    productRouter.delete("/product/:product_id", productController.delete);

    app.use(productRouter);

    productService.getProductQuantity();
    productService.updateProductQuantity();
  } catch (e) {
    console.error("Failed to initialize app:", e);
    process.exit(1);
  }
}

startServer();

export default app;
