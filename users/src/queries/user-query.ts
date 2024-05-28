export const userQueries = {
  create: "INSERT INTO users(email, password, name) values(?, ?, ?)",
  getByEmail: "SELECT * FROM users WHERE email = ?",
};