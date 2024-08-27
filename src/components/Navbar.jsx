import { useState, useEffect, useContext } from "react";
import { Outlet, useOutletContext, Link } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useOutletContext();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {isAuthenticated && <Link to="/submit">Submit a new post</Link>}
      {!isAuthenticated && <Link to="/signup">Sign up</Link>}
      {!isAuthenticated && <Link to="/login">Log in</Link>}
      {isAuthenticated && <Link to="/logout">Log out</Link>}
    </nav >
  )
}