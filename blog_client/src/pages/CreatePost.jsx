import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';


export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  // console.log(formData);
  

  //Function to handle image uploading
  const handleUploadImage = async() =>{
    try {
      if(!file){
        setImageFileUploadError('Please select an Image.')
        return;
      }
      setImageFileUploadError(null)
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
            'state_changed',
            (snapshot) =>{
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Something went wrong. Upload Failed');
                setImageFileUploadProgress(null);
                
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                  setImageFileUploadProgress(null);
                  setImageFileUploadError(null);
                  setFormData({...formData, image: downloadURL});
                })
            }
        )
    } catch (error) {
      setImageFileUploadError('Image Upload Failed');
      setImageFileUploadProgress(null);
      console.log(error);
    }
  }

  //Function to handle the submition of the Post Form
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      if(res.ok){
        setPublishError(null); 
        navigate(`/post/${data.slug}`);
      }

    } catch (error) {
      setPublishError('Something Went Wrong');
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                     <option value='uncategorized'>Select a Category</option>
                     <option value='javascript'>JavaScript</option>
                     <option value='reactjs'>React.js</option>
                     <option value='nextjs'>Next.js</option>
                     <option value='ruby'>Ruby</option>
                     <option value='python'>Python</option>
                     <option value='typescript'>TypeScript</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-lime-500 border-dotted p-3 '>
                <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
                <Button type='button' gradientMonochrome="lime" size='sm' outline onClick={handleUploadImage} disabled={imageFileUploadProgess}>{
                  imageFileUploadProgess?(
                  <div className='w-16 h-16'>
                    <CircularProgressbar value={imageFileUploadProgess} text={`${imageFileUploadProgess || 0}`} />
                  </div>
                  ):('Upload Image')
                  }</Button>
            </div>
            {imageFileUploadError &&(
              <Alert color='failure'>{imageFileUploadError}</Alert>
            )}
            {formData.image && (<img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>)}
            <ReactQuill theme='snow' placeholder='Start Writing' className='h-72 mb-12' required onChange={(value) => {
              setFormData({...formData, content: value})
            }}/>
            <Button type='submit' gradientMonochrome="lime">Publish</Button>
            {
              publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
            }
        </form>
    </div>
  )
}
