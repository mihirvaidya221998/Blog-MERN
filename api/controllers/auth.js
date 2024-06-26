import User from '../models/user.js';
import bcryptjs from 'bcryptjs';

//SignUp Controller
export const signup = async(req, res) =>{
    const {username, email, password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(400).json({message: 'All Fields are Required!'});
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.json({message: 'User registered successfully!'});
        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
    
}