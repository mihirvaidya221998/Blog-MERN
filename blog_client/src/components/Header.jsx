import React, { useEffect, useState } from 'react'

import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);
    const {theme} = useSelector((state) => state.theme);

    //Search Functionality
    const [searchTerm, setSearchTerm] = useState('');
    // console.log(searchTerm)

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])

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

    //Handle the submition of search term
    const handleSubmit = (e) =>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
  return (
      <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg text-black'>Mugiwara Blog</span>
        </Link>
        <form onSubmit={handleSubmit}>
            <TextInput
               type='text'
               placeholder='Search'
               rightIcon={AiOutlineSearch}
               className='hidden lg:inline'
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className='w-12 h10 lg:hidden' color='gray' pill>
           <AiOutlineSearch/> 
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button pill className='w-12 h-10 hidden sm:inline' color='gray' onClick={()=>dispatch(toggleTheme())}>
                {theme === 'light'?<FaMoon/>:<FaSun/>}
            </Button>
            {currentUser?(
                <Dropdown arrowIcon={false} inline label={
                    <Avatar alt='user' img={currentUser.profilePic} rounded/>
                    }>
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                    
                </Dropdown>
            ):
            (
                <Link to='/sign-in'>
                <Button gradientMonochrome="lime">
                    Sign In
                </Button>
            </Link>
        )}
            
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
  )
}
