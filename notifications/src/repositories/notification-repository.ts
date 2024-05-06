import mysql2 from "mysql2";
import { NotificationModel } from "../models/notification-model";

export class NotificationRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

	create(notificationModel: NotificationModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const q = `INSERT INTO notifications(message) values (?)`;
      this.db.query(
        q,
        [notificationModel.message],
        (err, rows: mysql2.ResultSetHeader) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows.insertId);
        }
      );
    });
  }
}
