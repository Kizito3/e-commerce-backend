import connectDB from "./config/db";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/_authRoutes";
import productRoutes from "./routes/_products.routes";
import categoryRoutes from "./routes/_category.routes";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port at http://localhost:${PORT}`);
});
connectDB()
  .then(() => {
    console.log("Server is running...");
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });
