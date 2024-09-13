import { useState, useEffect, useContext } from "react";
import { Outlet, useOutletContext, Link } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, apiUrl] = useOutletContext();

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated && <Link to="/submit">Create a new post</Link>}
      {!isAuthenticated && <Link to="/signup">Sign up</Link>}
      {!isAuthenticated && <Link to="/login">Log in</Link>}
      {isAuthenticated && <Link to="/logout">Log out</Link>}
    </nav >
  )
}