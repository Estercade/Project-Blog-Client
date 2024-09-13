import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Submit() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  const [postFormTitle, setPostFormTitle] = useState("");
  const [postFormContent, setPostFormContent] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("jwt")) {
      navigate("/login");
    }
  }, []);

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
        await fetch(apiUrl + "posts/", {
          method: "POST",
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
              navigate("/login");
            }
            return response.json();
          })
      } catch (err) {
        console.log(err);
      }
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
        await fetch(apiUrl + "posts/", {
          method: "POST",
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
              navigate("/login");
            }
            return response.json();
          })
          .then(response => {
            navigate(`/posts/${response.id}`);
          })
      } catch (err) {
        console.log(err);
      }
    }
  }

  function handleCancelPost(e) {
    e.preventDefault();
    navigate("/");
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
        <button className="savePostButton" onClick={handleSavePost}>Save as draft</button>
        <button className="publishPostButton" onClick={handlePublishPost}>Publish</button>
        <button className="cancelPostButton" onClick={handleCancelPost}>Cancel</button>
      </form>
    </>
  )
}