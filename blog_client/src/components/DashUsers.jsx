import { Table, Modal, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {FaCheck, FaTimes} from 'react-icons/fa'
import { BsExclamationCircle } from "react-icons/bs";

export default function DashUsers() {
  const {currentUser} = useSelector((state) => state.user)
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const { theme } = useSelector((state) => state.theme);
  // console.log(userPosts)
  useEffect(()=>{
    const fetchUsers = async () =>{
      try {
        const res = await fetch(`/api/user/get-users`);
        const data = await res.json();
        if(res.ok){
          setUsers(data.users)
          if (data.users.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(currentUser.isAdmin){
      fetchUsers();
    }
  }, [currentUser._id])

  //Function to handle show more
  const handleShowMore = async() =>{
    const startLength = users.length;
    try {
      const res = await fetch(`/api/user/get-users?startIndex=${startLength}`);
      const data = await res.json();
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9 ){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Handle deletion of the post
  const handleDeleteUserButton = async() =>{
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`,
            {method: 'DELETE'}
        )
        const data = await res.json();
        if(res.ok){
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              
            </Table.Head>
            {users.map((user) =>(
                <Table.Body className='divide-y' key={user._id}>
                  <Table.Row className='bg-white dark:border-gray-500 dark:bg-gray-800'>
                    <Table.Cell>{new Date(user.createdAt).toDateString()}</Table.Cell>
                    <Table.Cell>
                      <img src={user.profilePic} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full'/>
                    </Table.Cell>
                    <Table.Cell>
                      {user.username}
                    </Table.Cell>
                    <Table.Cell>
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (<FaCheck className='text-green-500'/>):(<FaTimes className='text-red-500'/>) }
                    </Table.Cell>
                    <Table.Cell>
                      <span onClick={()=>{
                        setShowModal(true);
                        setUserIdToDelete(user._id)
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
        <p>You have no users yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}/>
        <Modal.Body className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
            <div className={`text-center ${theme === 'dark' ? 'dark' : ''}`}>
               <BsExclamationCircle className='h-10 w-10 text-red-500 dark:text-red-500 dark: mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg '>Are you sure you want to delete this User?</h3>
               <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUserButton}>Yes</Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>Cancel</Button>
               </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
