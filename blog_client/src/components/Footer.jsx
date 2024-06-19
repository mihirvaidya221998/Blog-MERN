import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsLinkedin, BsGithub, BsInstagram, BsFacebook } from "react-icons/bs";

export default function FooterComp() {
  return (
    <Footer container className='border border-t-8 border-lime-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
               <div className='mt-5'>
                <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                    <span className='px-2 py-1 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg text-black'>Mugiwara Blog</span>
                </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 sm: mt-4 sm:grid-cols-3 sm:gap-6'>
                    {/* About */}
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://bloomington.iu.edu/index.html' target='_blank' rel='noopener noreferrer'>
                                IUB
                            </Footer.Link>
                            <Footer.Link href='/about' target='_blank' rel='noopener noreferrer'>
                                Mihir Vaidya
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    {/* Social Media */}
                    <div>
                        <Footer.Title title='Follow Us'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://github.com/mihirvaidya221998' target='_blank' rel='noopener noreferrer'>
                                Github
                            </Footer.Link>
                            <Footer.Link href='https://www.linkedin.com/in/mihirvaidya22/' target='_blank' rel='noopener noreferrer'>
                                LinkedIn
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    {/* Legal */}
                    <div>
                        <Footer.Title title='Legal'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                Terms &amp; Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div> 
            </div>
            <Footer.Divider/>
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright href='#' by='Mihir Vaidya' year={new Date().getFullYear()}/>
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='https://www.linkedin.com/in/mihirvaidya22/' icon={BsLinkedin }/>
                    <Footer.Icon href='https://github.com/mihirvaidya221998' icon={BsGithub }/>
                    <Footer.Icon href='#' icon={BsInstagram }/>
                    <Footer.Icon href='#' icon={BsFacebook }/>
                </div>
            </div>
        </div>
    </Footer>
  )
}
