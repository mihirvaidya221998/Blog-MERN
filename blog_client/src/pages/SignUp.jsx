import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import OAuth from '../components/OAuth';
import ProfileCapture from '../components/ProfileCapture';
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();
  const SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

  // console.log('Captcha Token: ',captchaToken);

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
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please enter all the fields!');
    }
    if (score === 0) {
      return setErrorMessage('Complete Identity Verification');
    }
    if (score <= 0.875) {
      return setErrorMessage('Identity Verification failed. Retry.');
    }
    if (!captchaToken) {
      return setErrorMessage('Please complete the CAPTCHA');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, captchaToken}),
      });
      const data = await res.json();
      if (data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
          <p className='text-sm mt-5'>This is a blog. Express yourself as much as you want. Sign-Up now and start writing your thoughts!</p>
        </div>
        {/* Right Div */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your Username'></Label>
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
            </div>
            <div className=''>
              <Label value='Your Email'></Label>
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
            </div>
            <div className=''>
              <Label value='Your Password'></Label>
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>
            <ProfileCapture score={score} setScore={setScore} />
            <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha}/>
            <Button gradientMonochrome="lime" outline type='submit' disabled={loading}>
              {
              loading? (
                <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                </>
             
              ) : 'Sign Up' }
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already Have An Account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
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


