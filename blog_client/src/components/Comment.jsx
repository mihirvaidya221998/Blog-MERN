import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function Comment({comment, onLike}) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user)
    // console.log(user);
    useEffect(()=>{
        const getUser = async () =>{
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment]);
  return (
    <div className='flex p-4 border-b dark:border-lime-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePic} alt={user.username} />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-sm truncate'>{user?`@${user.username}`:'Anonymous User'}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow() }</span>
        </div>
        <p className='text-gray-500 mb-2 dark:text-white'>{comment.content}</p>
        <div type='button' onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-lime-500 ${
          currentUser && comment.likes.includes(currentUser._id) && '!text-lime-500'
        }`}>
          <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
            <button><FaThumbsUp className='text-sm'/></button>
            <p className='text-gray-500 dark:text-white'>
              {comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Like":"Likes")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
