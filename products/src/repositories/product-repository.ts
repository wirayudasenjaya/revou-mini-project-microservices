import mysql2 from "mysql2";

import { ProductModel } from "../models/product-model";
import { productQueries } from "../queries/product-query";

export class ProductRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

  getAll(): Promise<ProductModel[]> {
    return new Promise<ProductModel[]>((resolve, reject) => {
      this.db.query(
        productQueries.getAll,
        (err, rows: mysql2.RowDataPacket[]) => {
          if (err) {
            reject(err);
            return;
          }

          let products: ProductModel[] = [];

          for (let i = 0; i < rows.length; i++) {
            products.push({
              id: rows[i].id,
              name: rows[i].name,
              quantity: rows[i].quantity,
              price: rows[i].price,
            });
          }

          resolve(products);
        }
      );
    });
  }

  getOne(product_id: number): Promise<ProductModel> {
    return new Promise<ProductModel>((resolve, reject) => {
      this.db.query(
        productQueries.getOne,
        [product_id],
        (err, rows: mysql2.RowDataPacket[]) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length == 0) {
            reject("data not found");
            return;
          }

          resolve({
            id: rows[0].id,
            name: rows[0].name,
            quantity: rows[0].quantity,
            price: rows[0].price,
          });
        }
      );
    });
  }

  add(productModel: ProductModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.query(
        productQueries.add,
        [productModel.name, productModel.quantity, productModel.price],
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

  edit(productModel: ProductModel, id: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const updatedData = {
        name: productModel.name,
        quantity: productModel.quantity,
        price: productModel.price,
      };

      this.db.query(
        productQueries.edit,
        [updatedData, id],
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

  delete(id: number) {
    return new Promise((resolve, reject) => {
      this.db.query(
        productQueries.delete,
        [id],
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
