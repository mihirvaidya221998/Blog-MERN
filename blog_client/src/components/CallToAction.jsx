import { Button } from 'flowbite-react';
import React from 'react';
import { FaLinkedin } from "react-icons/fa6";

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-lime-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        {/* Contet of the add  on left side*/}
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn more about Mihir?</h2>
        <p className='text-gray-500 my-2'>Checkout his LinkedIn profile and send him a connection request!</p>
        <Button gradientDuoTone='cyanToBlue' className='rounded-tl-xl rounded-bl-none'>
            <FaLinkedin className='w-6 h-6 mr-2'/>
            <a href="https://www.linkedin.com/in/mihirvaidya22/" target='_blank' rel='noopener norefferer'>Learn More</a>
        </Button>
      </div>
      {/* Image of the add on right side*/}
      <div className='p-7 flex-1'>
        <img src="https://blog.yumasoft.pl/wp-content/uploads/2020/04/java-script.jpeg" alt="" />
      </div>
    </div>
  )
}
