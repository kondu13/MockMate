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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.use('/api/v1', mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    keyValue: err.keyValue
  });
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'fail',
      message: messages.join(', ')
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'fail',
      message: `${field} '${err.keyValue[field]}' already exists`
    });
  }

  // Handle other errors
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

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