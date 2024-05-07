import { consumeFromQueue } from "../consumers/notification-consumer";
import { NotificationRepository } from "../repositories/notification-repository";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async createNotification() {
    consumeFromQueue("create-order", async (order: any) => {
      console.log("Received new order:", order);

      try {
        const orders = await this.notificationRepository.create({
          id: 0,
          message: "Notification Created",
          date: new Date(),
        });

        return {
          id: orders,
        };
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    });
  }
}
