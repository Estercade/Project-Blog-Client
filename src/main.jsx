import { StrictMode, useState, useEffect } from "react";
import { createRoot, Route, Navigate } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Index from "./components/Index.jsx";
import Posts from "./components/Posts.jsx";
import Users from "./components/Users.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Submit from "./components/Submit.jsx";
import Edit from "./components/Edit.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const apiUrl = "http://localhost:3000/";

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setIsAuthenticated(true);
      setCurrentUser(localStorage.getItem("currentUser"));
    };
  }, []);

  return (
    <Outlet context={[isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl]} />
  )
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Index />
        )
      },
      {
        path: "login",
        element: (
          <Login />
        )
      },
      {
        path: "signup",
        element: (
          <Signup />
        )
      },
      {
        path: "posts/:postId",
        element: (
          <Posts />
        )
      },
      {
        path: "users/:username",
        element: (
          <Users />
        )
      },
      {
        path: "logout",
        element: (
          <Logout />
        )
      },
      {
        path: "submit",
        element: (
          <Submit />
        )
      },
      {
        path: "edit/:postId",
        element: (
          <Edit />
        )
      },
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)