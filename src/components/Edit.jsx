import { useState, useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Edit() {
  const [postFormTitle, setPostFormTitle] = useState("");
  const [postFormContent, setPostFormContent] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useOutletContext();
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3000/";
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
          navigate("/", { errorDisplay: "403: You do not have access to this file." });
        }
        return response.json();
      })
      .then(response => {
        console.log(response.title);
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
          console.log(response);
          if (response.status === 401) {
            localStorage.removeItem("jwt");
            setIsAuthenticated(false);
            navigate("/login");
          }
          return response.json();
        })
    } catch (err) {
      console.log(err);
    }
  }

  async function handlePublishPost(e) {
    e.preventDefault();
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

  return (
    <>
      <Navbar />
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
      </form>
    </>
  )
}