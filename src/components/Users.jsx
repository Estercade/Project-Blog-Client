import { useState, useEffect } from "react";
import { Routes, Route, useParams, Link } from 'react-router-dom';
import Navbar from "./Navbar";

export default function Users({ post }) {
  // get the postId param from the URL
  const { userId } = useParams();

  const apiUrl = "http://localhost:3000/";

  const [userDetails, setUserDetails] = useState(null);

  async function fetchUserDetails() {
    await fetch(apiUrl + "users/" + userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(response => {
        setUserDetails(response);
      })
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      {userDetails && <div className="userDetailsContainer">
        <p>{userDetails.username}</p>
        <p>Posts: {userDetails.posts.length}</p>
        <p>Comments: {userDetails.comments.length}</p>
      </div>}
      {userDetails && <div className="userPostsContainer">
        <h3>Posts</h3>
        {userDetails.posts.map(blogPost => {
          return (
            <div className="postContainer" key={blogPost.id}>
              <h4 className="blogPostTitle">{blogPost.title}</h4>
              <p className="blogPostAuthor"><a href={"/users/" + blogPost.author.username}>by {blogPost.author.username}</a></p>
              <p className="blogPostContent">{blogPost.content}</p>
              <p className="blogPostPublishedAt">Posted on {blogPost.publishedAt}</p>
              <p className="blogPostRating">{blogPost.averageRating !== null ? Number(blogPost.averageRating).toFixed(2) : "no rating"}</p>
            </div>
          )
        })}
      </div>}
      {userDetails && <div className="userCommentsContainer">
        <h3>Comments</h3>
        {userDetails.comments.map(comment => {
          return (
            <div className="commentContainer" key={comment.id}>
              <p>{comment.content}</p>
              <p className="commentAuthor"><a href={"/users/" + comment.author.username}>by {comment.author.username}</a></p>
              <p>{comment.posted}</p>
            </div>
          )
        })}
      </div>}
    </>
  )
}