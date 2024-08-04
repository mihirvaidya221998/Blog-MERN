import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({comment, onLike, onEdit}) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user)
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);
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

    const handleEdit = () =>{
      setIsEditing(true);
      setEditedComment(comment.content);
    }

    //Saving the edited Comment
    const handleSave = async() =>{
      try {
        const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({content: editedComment})
        });
        if(res.ok){
          setIsEditing(false);
          onEdit(comment, editedComment);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
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
        {isEditing?(
          <>
              <Textarea className='mb-2' value={editedComment} onChange={(e) => setEditedComment(e.target.value)}/>
              <div className='flex justify-end gap-2 text-xs'>
                <Button type='button' size='sm' gradientMonochrome='lime' onClick={handleSave}>Save</Button>
                <Button type='button' size='sm' gradientMonochrome='lime' outline onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
              
          </>
          
        ): (
          <>
            <p className='text-gray-500 mb-2 dark:text-white'>{comment.content}</p>
            
          <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
            <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-lime-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-lime-500'}`}><FaThumbsUp className='text-sm'/></button>
            <p className='text-gray-500 dark:text-white'>
              {comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Like":"Likes")}
            </p>
            {
              currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <button type='button' onClick={handleEdit} className='text-gray-500 dark:text-white dark:hover:text-lime-500 hover:text-lime-500'>Edit</button>
              )
            }
          </div>
        
          </>
        )}
        
      </div>
    </div>
  )
}
