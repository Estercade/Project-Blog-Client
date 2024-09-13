import { useState, useEffect } from "react";
import { Routes, Route, useParams, Link, useOutletContext } from 'react-router-dom';
import Navbar from "./Navbar";

export default function Users() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  // get the username param from the URL
  const { username } = useParams();
  const [shownSection, setShownSection] = useState("posts");

  const [userDetails, setUserDetails] = useState(null);

  async function fetchUserDetails() {
    await fetch(apiUrl + "users/" + username, {
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

  function showPostsSection() {
    setShownSection("posts");
  }

  function showCommentsSection() {
    setShownSection("comments");
  }

  return (
    <>
      <Navbar />
      {userDetails &&
        <>
          <div className="userDetailsContainer">
            <p>{userDetails.username}</p>
            <button className="showPostsButton" onClick={showPostsSection}>{userDetails.posts.length} Posts</button>
            <button className="showCommentsButton" onClick={showCommentsSection}>{userDetails.comments.length} Comments</button>
          </div>
          {shownSection === "posts" && <div className="userPostsContainer">
            {userDetails.posts.map(post => {
              return (
                <div className="postContainer" key={post.id}>
                  <Link to={"/posts/" + post.id}><h4 className="postTitle">{post.title}</h4></Link>
                  <p className="postAuthor"><a href={"/users/" + post.author.username}>by {post.author.username}</a></p>
                  <p className="postContent">{post.content}</p>
                  <p className="postPublishedAt">Posted on {post.publishedAt}</p>
                  {post.lastEditedAt && <p className="postLastEditedAt">Last edited on {post.lastEditedAt}</p>}
                  <p className="postRating">Rating: {post.totalRating}</p>
                </div>
              )
            })}
          </div>}
          {shownSection === "comments" && <div className="userCommentsContainer">
            {userDetails.comments.map(comment => {
              return (
                <div className="commentContainer" key={comment.id}>
                  <p>{comment.content}</p>
                  <p className="commentAuthor"><a href={"/users/" + comment.author.username}>by {comment.author.username}</a></p>
                  <p>on {comment.postedAt}</p>
                  <p>in <Link to={"/posts/" + comment.post.id}>{comment.post.title}</Link></p>
                </div>
              )
            })}
          </div>}
        </>
      }
    </>
  )
}