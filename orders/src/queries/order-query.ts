export const orderQueries = {
    getAll: "SELECT * FROM orders WHERE user_id = ?",
    create: "INSERT INTO orders(product_id, user_id, quantity) values (?, ?, ?)",
    updateStatus: "UPDATE orders SET status = ? WHERE id = ?"
  };