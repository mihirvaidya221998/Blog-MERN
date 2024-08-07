import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {Alert, Button, Modal, Textarea, TextInput} from 'flowbite-react';
import Comment from './Comment';
import { editComment } from '../../../api/controllers/comment';
import { BsExclamationCircle } from 'react-icons/bs';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user);
    const [comment, setComment] =  useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    //Show Modal inorder to delete 
    const [showModal, setShowModal] = useState(false);
    //State to pass the id to delete
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    // console.log(comments);

    //React Hook to get all the comments
    useEffect(() =>{
      const getComments = async() =>{
         try {
          const res = await fetch(`/api/comment/get-comments/${postId}`);
          //console.log(res)
          if(res.ok){
            const data = await res.json();
            setComments(data);
          }
         } catch (error) {
          console.log(error.message);
         }
      }
      getComments();
    },[postId])

    const handleSubmit = async(e) =>{
      e.preventDefault();
      if(comment.length > 200){
        return;
      }

      try {
        const res = await fetch('/api/comment/create-comment',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: comment, postId, userId: currentUser._id}),

      });
      const data = await res.json();
      if(res.ok){
        setComment('');
        setCommentError(null);
        setComments([data, ...comments])
      }
      } catch (error) {

        setCommentError(error.message);
      }
      
    };

    const handleLike = async(commentId) =>{
      try {
        if(!currentUser){
          navigate('/sign-in');
          return;
        }
        const res = await fetch(`/api/comment/like-comment/${commentId}`, {
          method: 'PUT',
        });
        if (res.ok){
          const data = await res.json();
          
          setComments(comments.map((comment) => 
            comment._id === commentId ? {
              ...comment,
              likes: data.likes,
              numberOfLikes: data.likes.length,
            }: comment 
          ))
        }

      } catch (error) {
        console.log(error.message);
      }
    }

    const handleEdit = async(comment, editedComment) => {
      setComments(comments.map((c) => 
        c._id === comment._id ? {...c, content: editedComment}: c
      ))
    }

    //Delete Comment
    const handleDelete = async(commentId) => {
      setShowModal(false)
      try {
        if(!currentUser){
          navigate('/sign-in');
          return;
        }
        const res = await fetch(`/api/comment/delete-comment/${commentId}`,{
          method: 'DELETE',
        });
        if (res.ok){
          const data = await res.json();
          setComments(comments.filter((comment) => comment._id !== commentId))
            
          
        }

      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ?(
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed In as:</p>
            <img src={currentUser.profilePic} alt="" className='h-5 w-5 object-cover rounded-full'/>
            <Link to={'/dashboard?tab=profile'} className='text-xs text-lime-600 hover:underline'>
                @{currentUser.username}
            </Link>
        </div>
      ):(
        <div className='text-sm text-lime-500 my-5 flex gap-1'>
            You Must be Signed In to Comment.
            <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                Sign In
            </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-lime-500 rounded-md p-3'>
          <Textarea placeholder='Add a comment...' rows='3' maxLength='200' onChange={(e) => setComment(e.target.value)} value={comment}/>
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gary-500 text-xs'>{200 - comment.length} Characters Remaining</p>
            <Button outline gradientMonochrome="lime" type='submit '>Submit</Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
          
        </form>
        
      )}

      {comments.length === 0 ?(
        <p className='text-sm my-5'>No Comments Yet.</p>
      ):(
        <>
        <div className='text-sm my-5 flex items-center gap-1'>
          <p>Comments:</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p>{comments.length}</p>
          </div>
        </div>
        {
          comments.map(comment =>(
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
              setShowModal(true);
              setCommentToDelete(commentId);
            }}/>
          ))
        }
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}/>
        <Modal.Body className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
            <div className={`text-center ${theme === 'dark' ? 'dark' : ''}`}>
               <BsExclamationCircle className='h-10 w-10 text-red-500 dark:text-red-500 dark: mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg '>Are you sure you want to delete this Comment ?</h3>
               <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={()=>handleDelete(commentToDelete)}>Yes</Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>Cancel</Button>
               </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
