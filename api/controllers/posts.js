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

//Get all the posts
export const getPosts = async(req, res, next) =>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},
                ]
            }),
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);
        const totalNumPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthsPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });
        res.status(200).json({
            posts,
            totalNumPosts,
            lastMonthsPosts,
        })
    } catch (error) {
        next(error);
    }
}

//Delete Posts Controller
export const deletePosts = async(req, res, next) =>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not authorized to delete this post.'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been deleted');
    } catch (error) {
        next(error);
    }
}