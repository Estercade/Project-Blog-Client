import { StrictMode, useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Index from "./components/Index.jsx";
import About from "./components/About.jsx";
import Posts from "./components/Posts.jsx";
import Users from "./components/Users.jsx"
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Submit from "./components/Submit.jsx";
import Edit from "./components/Edit.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setIsAuthenticated(true);
    };
  }, []);

  return (
    <Outlet context={[isAuthenticated, setIsAuthenticated]} />
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
        path: "about",
        element: (
          <About />
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
        path: "users/:userId",
        element: (
          <Users />
        ),
        children: [
          {
            path: "posts",
            element: (
              <Posts />
            )
          }
        ]
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
      }
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)