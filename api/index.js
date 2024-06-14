import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

const app = express();
dotenv.config();
mongoose
.connect(process.env.db)
.then(() =>{
    console.log('MongoDB is connected successfully');
})
.catch((err) =>{
    console.log(err);
});

app.use(express.json());

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
//SignUp
app.use('/api/auth', authRoutes);