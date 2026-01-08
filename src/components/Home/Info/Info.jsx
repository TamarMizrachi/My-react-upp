import { useAuth } from "../../../context/AuthContext";

const Info = () => {
  const { user } = useAuth();

  return (
    <div className="info-page">
      <h2>User Information</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      <h3>Address</h3>
      <p>
        {user.address.street}, {user.address.city}
      </p>

      <h3>Company</h3>
      <p>{user.company.name}</p>
    </div>
  );
};

export default Info;
