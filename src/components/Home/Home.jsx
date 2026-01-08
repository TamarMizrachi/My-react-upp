import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h2>Welcome, {user.name}</h2>

      <div className="home-buttons">
        <button onClick={() => navigate("/info")}>Info</button>
        <button onClick={() => navigate("/todos")}>Todos</button>
        <button onClick={() => navigate("/posts")}>Posts</button>
        <button onClick={() => navigate("/albums")}>Albums</button>
        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
