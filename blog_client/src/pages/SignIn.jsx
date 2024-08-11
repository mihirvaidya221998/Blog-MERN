import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import ReCAPTCHA from "react-google-recaptcha";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;
  // Handling the inputs in the form
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

      // CAPTCHA Logic
  const handleCaptcha = async(value) =>{
    setCaptchaToken(value);
  }
  
  //Handling the submition of the form
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if( !formData.email || !formData.password){
      return dispatch(signInFailure('Please enter all the fields!'))
    }
    if (!captchaToken) {
      return dispatch(signInFailure('Please complete the CAPTCHA'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, captchaToken})
      });
      const data = await res.json();
      if (data.success === false){
        dispatch(signInFailure(data.message));
      }
      
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* Left Div */}
        <div className='flex-1'>
          
          <Link to='/' className='font-bold dark:text-white text-4xl'>
                <span className='px-2 py-1 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg text-black'>Mugiwara Blog</span>
          </Link>
          <p className='text-sm mt-5'>This is a blog. Express yourself as much as you want. Sign-In now and start writing your thoughts!</p>
        </div>
        {/* Right Div */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            <div className=''>
              <Label value='Your Email'></Label>
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
            </div>
            <div className=''>
              <Label value='Your Password'></Label>
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>
            <div className=''>
              <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha}/>
            </div>
            <Button gradientMonochrome="lime" type='submit' outline disabled={loading}>
              {
              loading? (
                <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                </>
             
              ) : 'Sign In' }
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't Have An Account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
