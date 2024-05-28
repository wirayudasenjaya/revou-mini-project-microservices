import mysql2 from "mysql2";
import { NotificationModel } from "../models/notification-model";
import { notificationQueries } from "../queries/notification-query";

export class NotificationRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

	create(notificationModel: NotificationModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.query(
        notificationQueries.create,
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
