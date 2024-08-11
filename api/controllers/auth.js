import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

//SignUp Controller
export const signup = async(req, res, next) =>{
    const {username, email, password, captchaToken} = req.body;
    //console.log(captchaToken);
    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All Fields are Required'))
    }

    const secretKey =  process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const googleVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    try {
        const captchaData = await axios.post(googleVerificationUrl);
        const captchaSuccess = captchaData.data.success;
        if(!captchaSuccess){
            return next(errorHandler(400, 'CAPTCHA verfication failed'));
        }
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({username, email, password: hashedPassword});
   
        await newUser.save();
        res.json({message: 'User registered successfully!'});
        
    } catch (error) {
        next(error);
        
    }
    
}

//Signin Controller
export const signin = async(req, res, next) => {
    const {email, password, captchaToken} = req.body;
    const secretKey =  process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const googleVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    if(!email || !password || !captchaToken || email==='' || password === ''){
        next(errorHandler(400, 'All Fields are Required!'));
    }

    try {
        const captchaData = await axios.post(googleVerificationUrl);
        const captchaSuccess = captchaData.data.success;
        if(!captchaSuccess){
            return next(errorHandler(400, 'CAPTCHA verfication failed'));
        }
        const signinEmail = await User.findOne({email});
        if(!signinEmail){
            return next(errorHandler(404, 'There is no such user!'));
        }
        const signinPassword = bcryptjs.compareSync(password, signinEmail.password);
        if(!signinPassword){
            return next(errorHandler(400, 'There is no such user!'));
        }
        const token = jwt.sign(
            {id: signinEmail._id, isAdmin: signinEmail.isAdmin},
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

// Google OAuth Logic
export const googleAuth = async(req, res, next)=>{
    
    const {email, name, googlePhotoUrl} = req.body;
    try {
        // Check if user exist
        const user = await User.findOne({email});
        if (user){
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
        else{
            // Creating a random password for the google user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePic: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
        
    } catch (error) {
        next(error);
    }
}