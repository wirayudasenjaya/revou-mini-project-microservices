import mysql2 from "mysql2";

import { OrderModel } from "../models/order-model";

export class OrderRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

  getAll(): Promise<OrderModel[]> {
    return new Promise<OrderModel[]>((resolve, reject) => {
      const q = `SELECT * FROM orders`;
      this.db.query(q, (err, rows: mysql2.RowDataPacket[]) => {
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
            status: rows[i].status
          });
        }

        resolve(products);
      });
    });
  }

  async create(orderModel: OrderModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const q = `INSERT INTO orders(product_id, user_id, quantity) values (?, ?, ?)`;
      this.db.beginTransaction((err) => {
        if (err) {
          reject(err);
          return;
        }

        this.db.query(
          q,
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
      const q = `UPDATE orders SET status = ? WHERE id = ?`;
      this.db.query(
        q,
        [status, id],
        (err, rows: mysql2.ResultSetHeader) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows.affectedRows);
        }
      );
    })
  }
}
