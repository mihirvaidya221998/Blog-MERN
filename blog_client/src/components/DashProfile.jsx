import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { BsExclamationCircle } from "react-icons/bs";
import {Link} from 'react-router-dom';

export default function DashProfile() {
    const {currentUser, error, loading} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(null); //To show that the image is uploaded successfully
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);//A state to show popup when the 
    const { theme } = useSelector((state) => state.theme);
    // console.log(theme)
    //Updating the User Information
    const [formData, setFormData] = useState({});
    // console.log(imageFileUploadProgess, imageFileUploadError)
    const filePickerRef = useRef();

    const dispatch = useDispatch();

    const handleImageChange = (e) =>{
        const file = e.target.files[0]
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
        
    }
    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile])

    const uploadImage = async() => {
        setImageFileUploading(true);
        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) =>{
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePic: downloadURL});
                    setImageFileUploading(false);
                })
            }
        )
    }

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.id]: e.target.value});

    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No Changes Made');
            return;
        }
        if(imageFileUploading){
            setUpdateUserError('Please wait for the image to upload');
            return;
        }
        try {
            dispatch(updateStart());
            // console.log(currentUser)
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }
            else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess('Profile updated successfully!')
            }
        } catch (error) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
        }
    }

    //Handle Delete Functionality
    const handleDeleteUserButton = async() =>{
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok){
                dispatch(deleteUserFailure(data.message));
            }
            else{
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    //Sign-Out Functionality
    const handleSignOut = async() =>{
        try {
            const res = await fetch('/api/user/signout', {
                 method: 'POST',
            });
            const data = res.json();
            if(!res.ok){
                console.log(data.message)
            }
            else{
                 dispatch(signoutSuccess());
            }
        } catch (error) {
           console.log(error.message) 
        }
    }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgess && (
                <CircularProgressbar value={imageFileUploadProgess || 0} text={`${imageFileUploadProgess}%`} strokeWidth={5} 
                    styles={{
                        root:{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,

                        },
                        path:{
                            stroke: `rgba(62, 152, 199, ${imageFileUploadProgess/100})`,
                        },
                    }}
                />
            )}
            <img src={imageFileUrl||currentUser.profilePic} alt="user" className={`rounded-full w-full f-full border-8 border-lime-500 object-cover ${imageFileUploadProgess && imageFileUploadProgess < 100 && 'opacity-60'}`}/>
        </div>
        {imageFileUploadError && (
            <Alert color='failure'>
                {imageFileUploadError}
            </Alert>
        )}
        
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
        <Button type='submit' gradientMonochrome="lime" outline disabled={loading || imageFileUploading}>{loading?'Loading': 'Update'}</Button>
        {currentUser.isAdmin &&(
            <Link to={'/create-post'}>
                <Button type='button' gradientMonochrome="lime" className='w-full'>Create A Post</Button>
            </Link>
            
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign-Out</span>
      </div>
      {updateUserSuccess &&(
        <Alert color='success' className='mt-5'>
            {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
            {updateUserError}
        </Alert>
      )}
      {/* Delete User Error */}
      {error &&(
        <Alert color='failure' className='mt-5'>
            {error}
        </Alert>
      )}

      {/* Show Modal Property */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}/>
        <Modal.Body className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
            <div className={`text-center ${theme === 'dark' ? 'dark' : ''}`}>
               <BsExclamationCircle className='h-10 w-10 text-red-500 dark:text-red-500 dark: mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg '>Are you sure you want to delete your account?</h3>
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
