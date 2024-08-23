import { errorHandler } from '../utils/error.js';
import OpenAI from 'openai';
import User from '../models/user.js';

//Handling Chatbot
export const chatWithBot = async (req, res, next) => {
    const {message} = req.body;
    try {
        const userId = req.user.id
        // console.log(userId);
        // console.log(message); 
        if(!message || message===''){
            return next(errorHandler(400, 'You have not written any message'));
        }
        const user = await User.findById(userId);
        if (!user){
            return next(errorHandler(401, "User not registered or Token Malfunction"))
        }
        // Prepare the chat history
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });

        //Configure OpenAI
        const openai = new OpenAI({
            organization: process.env.ORGANIZATION_ID,
            project: process.env.PROJECT_ID
        });
        // console.log(openai);

        // Get Latest Response
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        })
        user.chats.push(stream.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Something went wrong!"));
    }
    
    
}