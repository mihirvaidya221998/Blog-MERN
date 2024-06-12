import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});