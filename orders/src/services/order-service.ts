import { v4 as uuidv4 } from "uuid";

import { CreateOrderRequest, GetAllOrderResponse } from "../models/order-model";
import { OrderRepository } from "../repositories/order-repository";
import { getQuantity, sendToQueue } from "../consumers/order-consumer";
import { sendToKafkaQueue } from "../consumers/order-consumer-kafka";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAll(userId: number): Promise<GetAllOrderResponse[]> {
    const orders = await this.orderRepository.getAll(userId);

    let orderResponse: GetAllOrderResponse[] = [];

    orders.forEach((order) => {
      orderResponse.push({
        id: order.id,
        product_id: order.product_id,
        user_id: order.user_id,
        quantity: order.quantity,
      });
    });

    return orderResponse;
  }

  async create(createOrderRequest: CreateOrderRequest) {
    try {
      const requestId = uuidv4();

      await sendToQueue("product-availability", {
        request_id: requestId,
        product_id: createOrderRequest.product_id,
      });

      const quantity = await getQuantity<number>(requestId, "get-product-quantity");

      if (quantity >= createOrderRequest.quantity) {
        const orderDetails = {
          id: 0,
          product_id: createOrderRequest.product_id,
          user_id: createOrderRequest.user_id,
          quantity: createOrderRequest.quantity,
        };

        const orders = await this.orderRepository.create(orderDetails);

        await sendToKafkaQueue("create-order-kafka", {
          ...orderDetails,
          id: orders,
        });
        await sendToQueue("create-order", { ...orderDetails, id: orders });
        await sendToQueue("update-product-quantity", orderDetails);

        return { id: orders };
      } else {
        throw new Error("Insufficient quantity");
      }
    } catch (error) {
      let errorMsg = "Error creating order";

      if (error instanceof Error) {
        errorMsg = error.message;
      }

      console.log("Error creating order", error);
      throw new Error(errorMsg);
    }
  }
}
