import { CreateOrderRequest, GetAllOrderResponse } from "../models/order-model";
import { OrderRepository } from "../repositories/order-repository";
import { sendToQueue } from "../consumers/order-consumer";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAll(): Promise<GetAllOrderResponse[]> {
    const orders = await this.orderRepository.getAll();

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
    const orders = await this.orderRepository.create({
      id: 0,
      product_id: createOrderRequest.product_id,
      user_id: createOrderRequest.user_id,
      quantity: createOrderRequest.quantity,
    });

    sendToQueue("create-order", {
      id: orders,
      product_id: createOrderRequest.product_id,
      user_id: createOrderRequest.user_id,
      quantity: createOrderRequest.quantity,
    });

    sendToQueue("update-product-quantity", {
      id: orders,
      product_id: createOrderRequest.product_id,
      user_id: createOrderRequest.user_id,
      quantity: createOrderRequest.quantity,
    });

    return {
      id: orders,
    };
  }
}
