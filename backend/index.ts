import cors from 'cors';
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
const cookieParser = require('cookie-parser');

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const mongoDbUrl = process.env.MONGODB_URI || "";

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth-routes");

// Routes Middlewares
app.use("/api", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.redirect(302, '/api')
});

// DB connection
mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("Connected to the database with Mongoose");
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

