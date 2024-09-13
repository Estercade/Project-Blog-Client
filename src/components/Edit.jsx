import { useState, useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Edit() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  const [post, setPost] = useState("");
  const [postFormTitle, setPostFormTitle] = useState("");
  const [postFormContent, setPostFormContent] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("jwt")) {
      navigate("/login");
    } else {
      fetchPostDetails(postId);
    }
  }, []);

  async function fetchPostDetails() {
    await fetch(apiUrl + "posts/" + postId, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `bearer ${localStorage.getItem("jwt")}`,
      }
    })
      .then(response => {
        if (response.status === 403) {
          return navigate("/", { errorDisplay: "403: You do not have access to this file." });
        }
        return response.json();
      })
      .then(response => {
        if (response === null) {
          return navigate("/", { errorDisplay: "404: File not found." })
        }
        setPost(response);
        setPostFormContent(response.content);
        setPostFormTitle(response.title);
      })
  }

  function handlePostFormTitleChange(e) {
    setPostFormTitle(e.target.value);
  }

  function handlePostFormContentChange(e) {
    setPostFormContent(e.target.value);
  }

  async function handleSavePost(e) {
    e.preventDefault();
    if (!postFormTitle | !postFormContent) {
      setErrorDisplay("Please fill out all the required fields.");
    } else {
      const data = {
        title: postFormTitle,
        content: postFormContent
      }
      try {
        await fetch(apiUrl + "posts/" + postId, {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (response.status === 401) {
              localStorage.removeItem("jwt");
              setIsAuthenticated(false);
              setCurrentUser(null);
              return navigate("/login");
            }
            if (response.status === 403) {
              return navigate("/");
            }
            return response.json();
          })
      } catch (err) {
        console.log(err);
      }
      return navigate("/");
    }
  }

  async function handlePublishPost(e) {
    e.preventDefault();
    if (!postFormTitle | !postFormContent) {
      setErrorDisplay("Please fill out all the required fields.");
    } else {
      const data = {
        title: postFormTitle,
        content: postFormContent,
        published: true
      }
      try {
        await fetch(apiUrl + "posts/" + postId, {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (response.status === 401) {
              localStorage.removeItem("jwt");
              setIsAuthenticated(false);
              setCurrentUser(null);
              return navigate("/login");
            }
            if (response.status === 403) {
              return navigate("/");
            }
            return response.json();
          })
          .then(response => {
            return navigate(`/posts/${response.id}`);
          })
      } catch (err) {
        console.log(err);
      }
      return navigate("/");
    }
  }

  async function handleDeletePost(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await fetch(apiUrl + "posts/" + postId, {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("jwt")}`,
          },
        })
          .then(response => {
            if (response.status === 401) {
              localStorage.removeItem("jwt");
              setIsAuthenticated(false);
              setCurrentUser(null);
              return navigate("/login");
            }
            if (response.status === 403) {
              return navigate("/");
            }
            return response.json();
          })
      } catch (err) {
        console.log(err);
      }
      return navigate("/");
    }
    return;
  }

  return (
    <>
      <Navbar />
      <div className="errorDisplay">{errorDisplay}</div>
      <form action="" method="POST" className="editPostForm">
        <div className="editPostFormItem">
          <label htmlFor="postTitle">Title: </label>
          <input id="postTitle" name="postTitle" type="text" value={postFormTitle} onChange={handlePostFormTitleChange} />
        </div>
        <div className="editPostFormItem">
          <label htmlFor="postContent">Content: </label>
          <textarea name="postContent" id="postContent" value={postFormContent} onChange={handlePostFormContentChange}></textarea>
        </div>
        <button className="savePostButton" onClick={handleSavePost}>Save</button>
        {!post.published && <button className="publishPostButton" onClick={handlePublishPost}>Publish</button>}
        <button className="deletePostButton" onClick={handleDeletePost}>Delete</button>
      </form>
    </>
  )
}