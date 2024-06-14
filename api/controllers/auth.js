import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

//SignUp Controller
export const signup = async(req, res, next) =>{
    const {username, email, password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All Fields are Required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.json({message: 'User registered successfully!'});
        
    } catch (error) {
        next(error);
        
    }
    
}