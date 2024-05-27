import { CreateOrderRequest, GetAllOrderResponse } from "../models/order-model";
import { OrderRepository } from "../repositories/order-repository";
import { consumeFromQueue, sendToQueue } from "../consumers/order-consumer";
import { sendToKafkaQueue } from "../consumers/order-consumer-kafka";

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
        status: order.status,
      });
    });

    return orderResponse;
  }

  async create(createOrderRequest: CreateOrderRequest) {
    try {
      const orders = await this.orderRepository.create({
        id: 0,
        product_id: createOrderRequest.product_id,
        user_id: createOrderRequest.user_id,
        quantity: createOrderRequest.quantity,
        status: "Pending",
      });

      await sendToQueue("process-new-order", {
        id: orders,
        product_id: createOrderRequest.product_id,
        user_id: createOrderRequest.user_id,
        quantity: createOrderRequest.quantity,
        status: "Pending",
      });

      return { id: orders, message: "Order is being processed" };
    } catch (error) {
      let errorMsg = "Error creating order";

      if (error instanceof Error) {
        errorMsg = error.message;
      }

      console.log("Error creating order", error);
      throw new Error(errorMsg);
    }
  }

  async processNewOrder() {
    consumeFromQueue("process-new-order", async (orders: any) => {
      try {
        await sendToQueue("product-availability", orders.product_id);

        const quantity = await new Promise<number>((resolve, reject) => {
          consumeFromQueue("get-product-quantity", (qty: any) => {
            console.log(qty);
            if (qty && qty.quantity) {
              resolve(qty.quantity);
            } else {
              this.orderRepository.orderStatus(orders.id, "Failed");
              reject(new Error(qty.error));
            }
          });
        });

        if (quantity >= orders.quantity) {
          const orderDetails = {
            id: orders.id,
            product_id: orders.product_id,
            user_id: orders.user_id,
            quantity: orders.quantity,
            status: orders.status,
          };

          await sendToKafkaQueue("create-order-kafka", orderDetails);
          await sendToQueue("create-order", orderDetails);
          await sendToQueue("update-product-quantity", orderDetails);

          await this.orderRepository.orderStatus(orders.id, "Success");
        } else {
          await this.orderRepository.orderStatus(orders.id, "Failed");

          console.log("Insufficient quantity");
        }
      } catch (error) {
        await this.orderRepository.orderStatus(orders.id, "Failed");

        console.log("Error processing new order", error);
      }
    });
  }
}
