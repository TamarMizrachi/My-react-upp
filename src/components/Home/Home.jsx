import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      
      <header className="welcome-header">
        <h1>Welcome, {user.username}</h1>
      </header>

    </div>
  );
};

export default Home;