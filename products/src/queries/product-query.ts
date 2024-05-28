export const productQueries = {
    getAll: "SELECT * FROM products",
    getOne: "SELECT * FROM products WHERE id = ?",
    add: "INSERT INTO products(name, quantity, price) values (?, ?, ?)",
    edit: "UPDATE products SET ? WHERE id = ?",
    delete: "DELETE FROM products WHERE id = ?"
  };