export const orderQueries = {
    getAll: "SELECT * FROM orders",
    create: "INSERT INTO orders(product_id, user_id, quantity) values (?, ?, ?)",
    updateStatus: "UPDATE orders SET status = ? WHERE id = ?"
  };