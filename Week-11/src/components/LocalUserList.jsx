import { useEffect, useState } from "react";

function LocalUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/users.json")
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => { setError("Error loading data"); setLoading(false); });
  }, []);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <h2>Local Users</h2>
      {users.map(user => (
        <div key={user.id} className="card">
          <p><strong>{user.name}</strong></p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default LocalUserList;
