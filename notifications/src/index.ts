import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
