import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

//Signin Controller
export const signin = async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password || email==='' || password === ''){
        next(errorHandler(400, 'All Fields are Required!'));
    }

    try {
        const signinEmail = await User.findOne({email});
        if(!signinEmail){
            return next(errorHandler(404, 'There is no such user!'));
        }
        const signinPassword = bcryptjs.compareSync(password, signinEmail.password);
        if(!signinPassword){
            return next(errorHandler(400, 'There is no such user!'));
        }
        const token = jwt.sign(
            {id: signinEmail._id},
            process.env.JWT_SECRET,
        );
        const {password: pass, ...rest} = signinEmail._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);
    } catch (error) {
        next(error);
    }
};