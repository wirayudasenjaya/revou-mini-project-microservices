import mysql2 from "mysql2";

import { OrderModel } from "../models/order-model";
import { orderQueries } from "../queries/order-query";

export class OrderRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

  getAll(): Promise<OrderModel[]> {
    return new Promise<OrderModel[]>((resolve, reject) => {
      this.db.query(
        orderQueries.getAll,
        (err, rows: mysql2.RowDataPacket[]) => {
          if (err) {
            reject(err);
            return;
          }

          let products: OrderModel[] = [];

          for (let i = 0; i < rows.length; i++) {
            products.push({
              id: rows[i].id,
              product_id: rows[i].product_id,
              user_id: rows[i].user_id,
              quantity: rows[i].quantity,
              status: rows[i].status,
            });
          }

          resolve(products);
        }
      );
    });
  }

  async create(orderModel: OrderModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.beginTransaction((err) => {
        if (err) {
          reject(err);
          return;
        }

        this.db.query(
          orderQueries.create,
          [orderModel.product_id, orderModel.user_id, orderModel.quantity],
          (err, rows: mysql2.ResultSetHeader) => {
            if (err) {
              this.db.rollback(() => {
                reject(err);
                return;
              });
            }

            this.db.commit((e) => {
              if (e) {
                this.db.rollback(() => {
                  reject(e);
                  return;
                });
              }

              resolve(rows.insertId);
            });
          }
        );
      });
    });
  }

  async orderStatus(id: number, status: string) {
    return new Promise<number>((resolve, reject) => {
      this.db.query(
        orderQueries.updateStatus,
        [status, id],
        (err, rows: mysql2.ResultSetHeader) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows.affectedRows);
        }
      );
    });
  }
}
