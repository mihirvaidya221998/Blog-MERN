import Post from "../models/post.js";
import { errorHandler } from "../utils/error.js"

//Create Posts
export const createPosts = async(req, res, next) => {
    if (!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to post blogs.'));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all the fields.'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    console.log('Slug: ',slug);
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id

    });

    try {
        const savePost = await newPost.save();
        res.status(201).json(savePost);
    } catch (error) {
        next(error);
    }
}