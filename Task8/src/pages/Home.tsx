import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>Shopping API</h1>

      <p>Welcome to the Shopping API frontend.</p>

      <button onClick={() => navigate("/products")}>
        View Products
      </button>

      <button onClick={() => navigate("/stores")}>
        View Stores
      </button>

      <button onClick={() => navigate("/checkout")}>
        Checkout
      </button>

      <button onClick={() => navigate("/orders")}>
        Order History
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}