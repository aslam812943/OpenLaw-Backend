import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./src/interface/routes/user/userRoutes";
import lawyerRoutes from "./src/interface/routes/lawyer/lawyerRoutes";
import adminRoutes from "./src/interface/routes/admin/adminRoutes";
import bookingRoutes from "./src/interface/routes/user/bookingRoutes";
import webhookRoutes from "./src/interface/routes/user/webhookRoutes";

import { DbConnection } from "./src/config/mongoose/DbConnection";
import { errorHandler } from "./src/interface/middlewares/errorHandler";
import { SocketServerService } from "./src/infrastructure/services/socket/socketServer";

dotenv.config();

const app = express();


//  DATABASE

DbConnection.connect();

//  MIDDLEWARES

app.use(cookieParser());

// IMPORTANT: Webhook route must be registered BEFORE express.json() middleware
// Stripe webhooks require raw body buffer for signature verification
// Use express.raw() specifically for webhook route
app.use("/api/webhook", express.raw({ type: 'application/json' }), webhookRoutes);

// Parse JSON for all other routes
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


//  ROUTES

app.use("/api/user", userRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);


app.use(errorHandler);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

//  Attach socket logic
const socketServerService = new SocketServerService();
socketServerService.setupSocketServer(io);


const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(` Server + Socket.IO running on port ${PORT}`);
});
