import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './mongodb/connect.js'
import cookieParser from 'cookie-parser'
import mainRouter from './routes/index.js'


dotenv.config()

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', mainRouter);

const PORT = process.env.PORT || 8000;

const startServer = () =>{
  try{
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, ()=>{
      console.log(`Server is running on port http:localhost:${PORT || 8000}`)
    })
  } catch(error){
    console.log(error)
  }
}

startServer();