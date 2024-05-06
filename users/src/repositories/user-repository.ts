import mysql2 from "mysql2";
import { UserModel } from "../models/user-model";

export class UserRepository {
  private db: mysql2.Connection;

  constructor(db: mysql2.Connection) {
    this.db = db;
  }

  create(UserModel: UserModel) {
    return new Promise<number>((resolve, reject) => {
      this.db.query(
        "INSERT INTO users(email, password, name) values(?, ?, ?)",
        [UserModel.email, UserModel.password, UserModel.name],
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

  getByEmail(email: string) {
    return new Promise<UserModel>((resolve, reject) => {
      this.db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
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
            email: rows[0].email,
            password: rows[0].password,
            name: rows[0].name,
          });
        }
      );
    });
  }
}
