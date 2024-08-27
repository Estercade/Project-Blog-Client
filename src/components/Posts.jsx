import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import Navbar from "./Navbar";

function Posts() {
  // get the postId param from the URL
  let { postId } = useParams();

  const apiUrl = "http://localhost:3000/";

  const [post, setPost] = useState(null);

  async function fetchpost() {
    await fetch(apiUrl + "posts/" + postId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(response => {
        setPost(response);
      })
  }

  useEffect(() => {
    fetchpost()
  }, []);

  return (
    <>
      <Navbar />
      {post && <div className="postContainer">
        <h3 className="postTitle">{post.title}</h3>
        <p className="postAuthor"><Link to={"/users/" + post.author.username}>by {post.author.username}</Link></p>
        <p className="postContent">{post.content}</p>
        <p className="postPublishedAt">Posted on {post.publishedAt}</p>
        <p className="postRating">{post.averageRating !== null ? Number(post.averageRating).toFixed(2) : "no rating"}</p>
      </div>}
      {post && <div className="commentsContainer" key={post.title + "comments"}>
        <h4 key="commentsContainerTitle">Comments<Link to="#comments"></Link></h4>
        {post.comments.map(comment => {
          return (
            <div className="commentItem" key={comment.id}>
              <p>{comment.content}</p>
              <p><Link to={"/users/" + comment.author.username}>{comment.author.username}</Link></p>
              <p>{comment.posted}</p>
            </div>
          )
        })}
      </div>}
    </>
  )
}

export default Posts;