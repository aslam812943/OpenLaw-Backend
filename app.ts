import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import userRoutes from './src/interface/routes/user/userRoutes'
import { DbConnection } from './src/config/mongoose/DbConnection'
import lawyerRoutes from './src/interface/routes/lawyer/lawyerRoutes'
import adminRouts from './src/interface/routes/admin/adminRoutes'
import bookingRoutes from './src/interface/routes/user/bookingRoutes';
import { errorHandler } from './src/interface/middlewares/errorHandler'
dotenv.config();

const app = express();

DbConnection.connect();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use("/api/user", userRoutes);
app.use('/api/lawyer', lawyerRoutes)
app.use('/api/admin', adminRouts)
app.use('/api/booking', bookingRoutes);

app.use(errorHandler)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
