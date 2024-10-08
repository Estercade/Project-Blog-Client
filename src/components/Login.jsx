import { useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Login() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");
  const navigate = useNavigate();

  function handleUsernameInputChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordInputChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmitLoginForm(e) {
    e.preventDefault();
    const data = {
      username: username,
      password: password
    };
    try {
      fetch(apiUrl + "login/", {
        method: 'POST',
        mode: "cors",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === 403) {
            setErrorDisplay("Incorrect username or password.");
            return;
          }
          return response.json();
        })
        .then(response => {
          // if login successful, store JWT in localStorage
          if (storageAvailable("localStorage")) {
            localStorage.setItem("jwt", response.token);
            localStorage.setItem("currentUser", response.currentUser);
            setIsAuthenticated(true);
            setCurrentUser(response.currentUser);
            navigate("/");
          } else {
            console.error("Local storage not available.");
          }
        })
    } catch (err) {
      console.log(err);
    }
  }

  // check if localStorage is available
  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        storage &&
        storage.length !== 0
    };
  }

  return (
    <>
      <Navbar />
      <div className="errorDisplay">{errorDisplay}</div>
      <form action="" method="">
        <div className="loginFormItem">
          <label htmlFor="username">Username: </label>
          <input name="username" id="username" type="text" required onChange={handleUsernameInputChange} />
        </div>
        <div className="loginFormItem">
          <label htmlFor="password"> Password: </label>
          <input name="password" id="password" type="password" required onChange={handlePasswordInputChange} />
        </div>
        <button className="loginFormSubmitButton" onClick={handleSubmitLoginForm}>Submit</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up.</Link></p>
    </>
  )
}