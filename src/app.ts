import express, { Application } from "express";
import cors from "cors";
import linkRoutes from "./routes/link.routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/", linkRoutes);

app.use(errorHandler);

export default app;
