import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from "flowbite-react";
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null); 
    const [recentPosts, setRecentPosts] = useState(null);
    // console.log(postSlug);
    useEffect(() =>{
        const fetchPost = async() =>{
            try {
                setLoading(true);
                const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok){
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);

                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug]);

    //Fetch Recent Posts
    useEffect(() =>{
      try {
        const fetchRecentPosts = async() =>{
          const res = await fetch('/api/post/get-posts?limit=3');
          const data = await res.json();
          // console.log(data)
          if(res.ok){
            setRecentPosts(data.posts);
          }
        }
        fetchRecentPosts(); 
      } catch (error) {
        console.log(error.message);
      }
    },[])
    if(loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' color="info" aria-label="Info spinner example" />
        </div>
    )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
      <div className='flex justify-between p-3 border-b border-lime-500 mx-auto w-full max-w-2xl text-xs'>
        <span className='italic'>{post && new Date(post.createdAt).toDateString()}</span>
        <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins to read</span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content-css' dangerouslySetInnerHTML={{__html: post && post.content}}>

      </div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction/>
      </div>
      <CommentSection postId={post._id}/>
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {
            recentPosts && recentPosts.map((post) =>(
              <PostCard key={post._id} post={post}/>
            ))
          }
        </div>
      </div>
    </main>
  )
}