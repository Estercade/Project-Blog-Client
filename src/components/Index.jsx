import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import "../assets/Index.css";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState("");

  const apiUrl = "http://localhost:3000/";

  async function fetchPosts() {
    await fetch(apiUrl + "posts/", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(response => {
        setPosts(response);
      })
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="errorDisplay">{errorDisplay}</div>
      <div className="postsContainer">
        <ul>
          {posts.map(post => {
            return (
              <li className="postListItem" key={post.id}>
                <h3 className="postTitle"><Link to={"/posts/" + post.id}>{post.title}</Link></h3>
                <p className="postAuthor"><Link to={"/users/" + post.author.username}>by {post.author.username}</Link></p>
                <Link to={"/posts/" + post.id}>
                  <p className="postContent">{post.content}</p>
                  <p className="postPublishedAt">Posted on {post.publishedAt}</p>
                </Link>
                <p className="postRating">{post.averageRating !== null ? Number(post.averageRating).toFixed(2) : "no rating"}</p>
                <p className="postCommentsCount"><Link to={"/posts/" + post.id + "/#comments"}>{post._count.comments} comments</Link></p>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}