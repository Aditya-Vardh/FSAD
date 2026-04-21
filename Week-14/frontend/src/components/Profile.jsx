import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate("/login"); return; }
    fetch(`http://localhost:8080/api/user/${userId}`)
      .then(res => { if (!res.ok) throw new Error("Failed to load profile"); return res.json(); })
      .then(setUser)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!user) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <Navbar />
      <h2>Profile</h2>
      <p>User ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email || "—"}</p>
    </div>
  );
}
