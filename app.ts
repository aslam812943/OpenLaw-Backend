import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import userRoutes from './src/interface/routes/user/  userRoutes'
import { DbConnection } from './src/config/mongoose/DbConnection'

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
