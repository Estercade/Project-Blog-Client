import { useState, useEffect } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useOutletContext();
  const navigate = useNavigate();

  const apiUrl = "http://localhost:3000/";

  function handleUsernameInputChange(e) {
    setUsername(e.target.value);
  }

  function handleEmailInputChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordInputChange(e) {
    setPassword(e.target.value);
  }

  function handlePasswordConfirmationInputChange(e) {
    setPasswordConfirmation(e.target.value);
  }

  function handleSubmitSignupForm(e) {
    e.preventDefault();
    if (!username | !email | !password | !passwordConfirmation) {
      setErrorDisplay("Please fill out all required fields.");
    } else if (password.length < 5) {
      setErrorDisplay("Password must be at least 5 characters long.");
    } else if (password !== passwordConfirmation) {
      setErrorDisplay("Passwords must match.");
    } else {
      const data = {
        username: username,
        email: email,
        password: password,
      }
      try {
        fetch(apiUrl + "users/", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (response.status === 403) {
              setErrorDisplay("That username already exists. Please choose another.");
              return;
            }
            if (response.status === 204) {
              setErrorDisplay("Please fill out all the required fields.");
              return;
            }
            return response.json();
          })
      } catch (err) {
        console.err;
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate("/");
      }, "5000");
    }
  })

  return (
    <>
      <Navbar />
      {!isAuthenticated && <>
        <div className="errorDisplay">{errorDisplay}</div>
        <form action="" method="">
          <div className="signupFormItem">
            <label htmlFor="username">Username: </label>
            <input name="username" id="username" type="text" required onChange={handleUsernameInputChange} />
          </div>
          <div className="signupFormItem">
            <label htmlFor="email">Email: </label>
            <input name="email" id="email" type="email" required onChange={handleEmailInputChange} />
          </div>
          <div className="signupFormItem">
            <label htmlFor="password">Password: </label>
            <input name="password" id="password" type="password" required onChange={handlePasswordInputChange} />
          </div>
          <div className="signupFormItem">
            <label htmlFor="passwordConfirmation">Confirm password: </label>
            <input name="passwordConfirmation" id="passwordConfirmation" type="password" required onChange={handlePasswordConfirmationInputChange} />
          </div>
          <button className="signupFormSubmitButton" onClick={handleSubmitSignupForm}>Submit</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign up here.</a></p>
      </>}
      {isAuthenticated &&
        <>
          <div>
            <h3>Welcome back!</h3>
            <p>You are already logged in and will be automatically redirected back to the homepage shortly.</p>
            <p>If you are not redirected automatically, please follow <Link to="/">this link.</Link></p>
            <p>If this is not your account, please follow <Link to="/">this link.</Link></p>
          </div>
        </>
      }
    </>
  )
}