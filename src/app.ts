import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./interface/routes/user/userRoutes";
import lawyerRoutes from "./interface/routes/lawyer/lawyerRoutes";
import adminRoutes from "./interface/routes/admin/adminRoutes";
import bookingRoutes from "./interface/routes/user/bookingRoutes";
import webhookRoutes from "./interface/routes/user/webhookRoutes";
import videoCallRoutes from "./interface/routes/common/videoCallRoutes";

import { DbConnection } from "./config/mongoose/DbConnection";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { SocketServerService } from "./infrastructure/services/socket/socketServer";

dotenv.config();

const app = express();




DbConnection.connect();


app.use(cookieParser());


app.use("/api/webhook", express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

// const allowedOrigins = (process.env.CLIENT_URL ?? '').split(',').map(url=>url.trim());
const allowedOrigins = [
  "https://www.openlaw.sbs",
  "https://openlaw.sbs",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔴 THIS LINE WAS MISSING — REQUIRED
// app.options("*", cors());



//  ROUTES

app.use("/api/user", userRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/video-call", videoCallRoutes);


app.use(errorHandler);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});


const socketServerService = new SocketServerService();
socketServerService.setupSocketServer(io);


const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(` Server + Socket.IO running on port ${PORT}`);
});
