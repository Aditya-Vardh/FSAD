import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!localStorage.getItem("userId")) navigate("/login");
  }, []);

  return (
    <div className="container">
      <Navbar />
      <h2>Welcome, {username}!</h2>
      <p>You are successfully logged in.</p>
    </div>
  );
}
