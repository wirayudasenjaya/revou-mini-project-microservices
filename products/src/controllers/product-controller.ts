import express from 'express';

import { ProductService } from "../services/product-service";
import { AddProductRequest } from '../models/product-model';

export class ProductController {
  private productService: ProductService;

	constructor(productService: ProductService) {
		this.productService = productService;
	}

	getAll = async (req: express.Request, res: express.Response) => {
		try {
      const getProductResponse = await this.productService.getAll();

      res.status(200).json({
        data: getProductResponse
      })
		} catch (e) {
      let errorMsg = "Server error";

      if (e instanceof Error) {
        errorMsg = e.message;
      }

      res.status(500).json({ error: errorMsg });
    }
	}

  getOne = async (req: express.Request, res: express.Response) => {
		try {
      const product_id = Number(req.params.product_id);

      const getOneProductResponse = await this.productService.getOne(product_id);

      res.status(200).json({
        data: getOneProductResponse
      })

		} catch (e) {
      let errorMsg = "Server error";

      if (e instanceof Error) {
        errorMsg = e.message;
      }

      res.status(500).json({ error: errorMsg });
    }
	}

  add = async (req: express.Request, res: express.Response) => {
    try {
      const createProductRequest = req.body as AddProductRequest;

      const createProductResponse = await this.productService.add(
        createProductRequest
      );

      res.status(200).json({
        data: createProductResponse,
      });
    } catch (e) {
      let errorMsg = "Server error";

      if (e instanceof Error) {
        errorMsg = e.message;
      }

      res.status(500).json({ error: errorMsg });
    }
  };

  delete = async (req: express.Request, res: express.Response) => {
    try {
      const product_id = Number(req.params.product_id);

      const deleteProduct = await this.productService.delete(product_id);

      res.status(200).json({
        message: 'deleted',
        id: product_id
      });
    } catch (e) {
      let errorMsg = "Server error";

      if (e instanceof Error) {
        errorMsg = e.message;
      }

      res.status(500).json({ error: errorMsg });
    }
  }
}