import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
