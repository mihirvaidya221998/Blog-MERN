import React from 'react'
import { Link } from 'react-router-dom'
import { Label, TextInput, Button } from 'flowbite-react'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* Left Div */}
        <div className='flex-1'>
          
          <Link to='/' className='font-bold dark:text-white text-4xl'>
                <span className='px-2 py-1 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg text-black'>Mugiwara Blog</span>
          </Link>
          <p className='text-sm mt-5'>This is a blog. Express yourself as much as you want. Sign-Up now and start writing your thoughts!</p>
        </div>
        {/* Right Div */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Your Username'></Label>
              <TextInput type='text' placeholder='Username' id='username'/>
            </div>
            <div className=''>
              <Label value='Your Email'></Label>
              <TextInput type='text' placeholder='Email' id='email'/>
            </div>
            <div className=''>
              <Label value='Your Password'></Label>
              <TextInput type='text' placeholder='Password' id='password'/>
            </div>
            <Button gradientMonochrome="lime" type='submit'>Sign Up</Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already Have An Account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
