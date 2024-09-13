import { useState, useEffect } from "react";
import { useParams, Link, useOutletContext, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Posts() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  const [commentFormShown, setCommentFormShown] = useState(false);
  const [commentFormContent, setCommentFormContent] = useState("");
  // get the postId param from the URL
  let { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  async function fetchpost() {
    try {
      await fetch(apiUrl + "posts/" + postId, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(response => response.json())
        .then(response => {
          setPost(response);
        })
    } catch (err) {
      console.log(err);
    }
  }

  function toggleCommentForm() {
    setCommentFormShown(!commentFormShown);
  }

  async function handleSubmitCommentButton(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      return
    } else {
      await postComment();
    }
  }

  function handleCancelCommentButton(e) {
    e.preventDefault();
    setCommentFormShown(false);
  }

  function handleCommentFormInputChange(e) {
    setCommentFormContent(e.target.value);
  }

  async function postComment() {
    const data = {
      content: commentFormContent,
      postId: postId
    }
    try {
      await fetch(apiUrl + "posts/" + postId + "/comments", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(response => {
          setCommentFormShown(false);
          fetchpost();
        })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchpost()
  }, []);

  return (
    <>
      <Navbar />
      {post && <div className="postContainer">
        <h3 className="postTitle">{post.title}</h3>
        <p className="postAuthor">by <Link to={"/users/" + post.author.username}>{post.author.username}</Link></p>
        <p className="postContent">{post.content}</p>
        <p className="postPublishedAt">Posted on {post.publishedAt}</p>
        {post.lastEditedAt && <p className="postLastEditedAt">Last edited on {post.lastEditedAt}</p>}
        <p className="postRating">Rating: {post.totalRating}</p>
        {currentUser === post.author.username && <Link to={"/edit/" + post.id}>Edit</Link>}
      </div>}
      {post && <div className="commentsContainer" key={post.title + "comments"}>
        <h4 key="commentsContainerTitle">Comments<Link to="#comments"></Link></h4>
        {isAuthenticated && <div className="postCommentContainer">
          <button className="toggleCommentFormButton" onClick={toggleCommentForm}>Post a reply</button>
          {commentFormShown && <form action="" method="POST" className="commentForm">
            <textarea name="commentFormInput" id="commentFormInput" onChange={handleCommentFormInputChange}></textarea>
            <button className="submitCommentFormButton" onClick={handleSubmitCommentButton}>Submit</button>
            <button className="cancelCommentFormButton" onClick={handleCancelCommentButton}>Cancel</button>
          </form>}
        </div>}
        {post.comments.map(comment => {
          return (
            <div className="commentItem" key={comment.id}>
              <p>{comment.content}</p>
              <p>posted by <Link to={"/users/" + comment.author.username}>{comment.author.username}</Link></p>
              <p>on {comment.postedAt}</p>
              {currentUser === comment.author.username &&
                <>
                  <textarea name="editCommentInput" id="editCommentInput"></textarea>
                  <button className="editCommentButton">Edit</button>
                  <button className="submitEditCommentButton">Save</button>
                  <button className="cancelEditCommentButton">Cancel</button>
                  <button className="deleteCommentButton">Delete</button>
                </>
              }
            </div>
          )
        })}
      </div>}
    </>
  )
}

export default Posts;