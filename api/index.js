import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comment.js';

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
//Extract cookie from the browser
app.use(cookieParser());

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
//SignUp
app.use('/api/auth', authRoutes);
//Posts
app.use('/api/post', postRoutes);
//Comments
app.use('/api/comment', commentRoutes);

//Error Handling Middleware
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});