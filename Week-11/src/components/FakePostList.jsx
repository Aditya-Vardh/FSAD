import { useEffect, useState } from "react";
import axios from "axios";

function FakePostList() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const userIds = ["all", "1", "2", "3", "4", "5"];

  const fetchPosts = () => {
    setLoading(true);
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(res => {
        setAllPosts(res.data);
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => { setError("Error fetching posts"); setLoading(false); });
  };

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    if (filter === "all") setPosts(allPosts);
    else setPosts(allPosts.filter(p => String(p.userId) === filter));
  }, [filter, allPosts]);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <h2>Fake API Posts</h2>
      <div className="filter-bar">
        <label>Filter by userId: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          {userIds.map(id => <option key={id} value={id}>{id === "all" ? "All" : `User ${id}`}</option>)}
        </select>
        <button onClick={fetchPosts} className="refresh-btn">Refresh</button>
      </div>
      {posts.slice(0, 10).map(post => (
        <div key={post.id} className="card">
          <p><strong>{post.title}</strong></p>
          <p>{post.body}</p>
          <small>User ID: {post.userId}</small>
        </div>
      ))}
    </div>
  );
}

export default FakePostList;
