import express from 'express';

import { OrderService } from "../services/order-service";
import { CreateOrderRequest } from '../models/order-model';

export class OrderController {
  private orderService: OrderService;

	constructor(orderService: OrderService) {
		this.orderService = orderService;
	}

	getAll = async (req: express.Request, res: express.Response) => {
		try {
			const getOrderResponse = await this.orderService.getAll(req.app.locals.user_id as number);

      res.status(200).json({
        data: getOrderResponse,
      });
		} catch (e) {
      let errorMsg = "Server error";

      if (e instanceof Error) {
        errorMsg = e.message;
      }

      res.status(500).json({ error: errorMsg });
    }
	}

	create = async (req: express.Request, res: express.Response) => {
    try {
      const createOrderRequest = req.body as CreateOrderRequest;

      const createOrderResponse = await this.orderService.create(
        createOrderRequest
      );
      console.log('controller', createOrderResponse);

      res.status(200).json({
        data: createOrderResponse,
      });
    } catch (e) {
      let errorMsg = "Server error";
      let status = 500

      if (e instanceof Error) {
        if(e.message.includes("Insufficient")) {
          status = 400
        }
        errorMsg = e.message;
      }

      res.status(status).json({ error: errorMsg });
    }
  };
}