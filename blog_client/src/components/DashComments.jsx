import { Table, Modal, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {FaCheck, FaTimes} from 'react-icons/fa'
import { BsExclamationCircle } from "react-icons/bs";

export default function DashComments() {
  const {currentUser} = useSelector((state) => state.user)
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const { theme } = useSelector((state) => state.theme);
  // console.log(userPosts)
  useEffect(()=>{
    const fetchComments = async () =>{
      try {
        const res = await fetch(`/api/comment/get-all-comments`);
        const data = await res.json();
        if(res.ok){
          setComments(data.comments)
          if (data.comments.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(currentUser.isAdmin){
      fetchComments();
    }
  }, [currentUser._id])

  //Function to handle show more
  const handleShowMore = async() =>{
    const startLength = comments.length;
    try {
      const res = await fetch(`/api/comment/get-all-comments?startIndex=${startLength}`);
      const data = await res.json();
      if(res.ok){
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9 ){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Handle deletion of the post
  const handleDeleteCommentButton = async() =>{
    setShowModal(false);
    try {
        const res = await fetch(`/api/comment/delete-comment/${commentIdToDelete}`,
            {method: 'DELETE'}
        )
        const data = await res.json();
        if(res.ok){
            setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
            setShowModal(false);
        }
        else{
            console.log(data.message); 
        }
    } catch (error) {
        console.log(error.message)
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-lime-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-lime-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Comment Content </Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostID</Table.HeadCell>
              <Table.HeadCell>UserID</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              
            </Table.Head>
            {comments.map((comment) =>(
                <Table.Body className='divide-y' key={comment._id}>
                  <Table.Row className='bg-white dark:border-gray-500 dark:bg-gray-800'>
                    <Table.Cell>{new Date(comment.updatedAt).toDateString()}</Table.Cell>
                    <Table.Cell>
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.postId}
                    </Table.Cell>
                    <Table.Cell>
                      {comment.userId}
                    </Table.Cell>
                    <Table.Cell>
                      <span onClick={()=>{
                        setShowModal(true);
                        setCommentIdToDelete(comment._id)
                      }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                    </Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-lime-500 self-center text-sm py-7'>Show More</button>
          )}
        </>
      ): (
        <p>You have no comments yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}/>
        <Modal.Body className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
            <div className={`text-center ${theme === 'dark' ? 'dark' : ''}`}>
               <BsExclamationCircle className='h-10 w-10 text-red-500 dark:text-red-500 dark: mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg '>Are you sure you want to delete this Comment?</h3>
               <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteCommentButton}>Yes</Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>Cancel</Button>
               </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
