import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import logger from "./infrastructure/logging/logger";
import userRoutes from "./interface/routes/user/userRoutes";
import lawyerRoutes from "./interface/routes/lawyer/lawyerRoutes";
import adminRoutes from "./interface/routes/admin/adminRoutes";
import bookingRoutes from "./interface/routes/user/bookingRoutes";
import webhookRoutes from "./interface/routes/user/webhookRoutes";
import videoCallRoutes from "./interface/routes/common/videoCallRoutes";

import { DbConnection } from "./config/mongoose/DbConnection";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { socketServerService } from "./di/container";

dotenv.config();

const app = express();




DbConnection.connect();


app.use(cookieParser());


app.use("/api/webhook", express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

const allowedOrigins = (process.env.CLIENT_URL ?? '').split(',').map(url => url.trim());

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

socketServerService.setupSocketServer(io);


import cron from "node-cron";
import { autoCancelExpiredBookingsUseCase } from "./di/cronContainer";

const PORT = process.env.PORT

// Schedule cleanup task to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    logger.info("Running automated booking cleanup...");
    await autoCancelExpiredBookingsUseCase.execute();
  } catch (error) {
    logger.error("Error in automated booking cleanup cron:", error);
  }
});

server.listen(PORT, () => {
  logger.info(` Server + Socket.IO running on port ${PORT}`);
});
