import express from "express";
import Database from "./config/db";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.use(express.json());
app.use("/api", userRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "API is running"
  });
});

const startServer = async () => {
  try {
    await Database.connect();

    app.listen(PORT, () => {
      console.log("Server running on http://localhost:"+PORT);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
