import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await fetch('/api/post/get-posts');
      const data = await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='3xl font-bold lg: text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Welcome to my blog website Mugiwara Blog, a dynamic platform where you can immerse yourself in insightful technical articles, share your thoughts, and engage with a vibrant community. Our user-friendly interface makes it easy to navigate through various topics, from technology to lifestyle, ensuring you find content that resonates with you. Whether you're here to read, comment, or contribute, we aim to provide a seamless and enriching experience. Join us in exploring, learning, and connecting with like-minded individuals. Your journey to discovery starts here!</p>
        <Link to='/search' className='text-xs sm:text-sm text-lime-500 font-bold hover:underline'>View All Posts</Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction/>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-lime-500 hover:underline text-center'>View All Posts</Link>
          </div>
        )}
      </div>
    </div>
  )
}
