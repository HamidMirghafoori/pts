import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const mongoDbUrl = process.env.MONGODB_URI || "";

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));

// // Your API endpoint to trigger SSE updates  SAMPLE
// app.post('/trigger-sse-update', (req, res) => {
//   const eventData = {
//     type: 'productAdded',
//     data: {
//       // Your product data
//     },
//   };

//   // Send the SSE event to all connected clients
//   clients.forEach((client) => {
//     client.write(`data: ${JSON.stringify(eventData)}\n\n`);
//   });

//   res.status(200).send('SSE update triggered');
// });


// Routes
const authRoutes = require("./routes/auth-routes");
const adminRoutes = require("./routes/admin-routes")
const businessRoutes = require("./routes/business-routes")
const shopRoutes = require("./routes/shop-routes")

app.use((req, res, next)=>{
  console.log('REQUEST URL:', req.originalUrl);
  
  next();
})

// Routes Middlewares
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", businessRoutes);
app.use("/api", shopRoutes);

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

