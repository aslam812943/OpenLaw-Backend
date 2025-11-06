import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import userRoutes from './src/interface/routes/user/  userRoutes'
import { DbConnection } from './src/config/mongoose/DbConnection'
import lawyerRouts from './src/interface/routes/lawyer/lawyerRoutes'
 import  adminRouts from './src/interface/routes/admin/adminRoutes'
dotenv.config();

const app = express();

DbConnection.connect();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use("/api/user", userRoutes);
app.use('/api/lawyer',lawyerRouts)
 app.use('/api/admin',adminRouts)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
