import { useEffect } from "react";
import { Outlet, useOutletContext, Link, useNavigate } from "react-router-dom";

export default function Logout() {
  const [isAuthenticated, setIsAuthenticated] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
    }
    navigate("/");
  }, []);
}