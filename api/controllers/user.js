import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.js";

//Test Controller
export const test = (req, res) =>{
    res.json({
        message: 'API is working'
    })
}

//Update User Profile
export const updateUser = async(req, res, next) => {
    // console.log(req.user);
    //If the person is not authenticated
    if (req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    
    //If the length of password is less than 6
    if (req.body.password) {
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'The password must be atleast 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    //Username should be greater than 7 and less than 20 characters
    if (req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400, 'The Username must be between 7 and 20 characters'));
        }

        //If username has any spaces
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot have any spaces'));
        }

        //Check if the username is lowercase
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'));
        }

        //Check for special characters
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username should only contain letters and numbers'));
        }
    }

        //Update the user
        try {
            console.log(req.body)
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePic: req.body.profilePic,
                    password: req.body.password,
                },
            }, {new: true});
            const {password, ...rest} = updatedUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error)
        }
    
};

//Delete User Profile
export const deleteUser = async(req, res, next) => {
    // if the  IDs do not match 
    if (!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted successfully');
    } catch (error) {
        next(error);
    }
};

//user signout
export const signout = (req, res, next) =>{
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
}

//Get all the users and show it to an Admin
export const getUsers = async (req, res, next) =>{
    if (!req.user.isAdmin){
        return next(errorHandler(403, 'You are not authorized to view all users'));
    }
    try {
        const startIndex =  parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);

        const usersPasswordExcluded = users.map((user) => {
            const {password, ...rest} = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();
        
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthsUsers = await User.countDocuments({createdAt: {$gte: oneMonthAgo}});

        res.status(200).json({
            users: usersPasswordExcluded,
            totalUsers,
            lastMonthsUsers
        })

    } catch (error) {
        next(error);
    }
}

//Get User for the comments section
export const getUser = async(req, res, next) =>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(errorHandler(404, 'User Not Found'));
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}