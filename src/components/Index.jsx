import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar";
import "../assets/Index.css";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState("");

  async function fetchPosts() {
    await fetch(apiUrl + "posts/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
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
                <p className="postAuthor">by <Link to={"/users/" + post.author.username}>{post.author.username}</Link></p>
                <p className="postContent">{post.content}</p>
                <p className="postPublishedAt">Posted on {new Date(post.publishedAt).toLocaleDateString("en-US", { timeZone: "EST", hour: "2-digit", minute: "2-digit" })}</p>
                {post.lastEditedAt && <p className="postLastEditedAt">Last edited on {new Date(post.lastEditedAt).toLocaleDateString("en-US", { timeZone: "EST", hour: "2-digit", minute: "2-digit" })}</p>}
                <p className="postRating">Rating: {post.totalRating}</p>
                <p className="postCommentsCount"><Link to={"/posts/" + post.id + "/#comments"}>{post._count.comments} comments</Link></p>
                {currentUser === post.author.username && <Link to={"/edit/" + post.id}>Edit</Link>}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}