import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { loginUser } from "../api/auth";


export default function Login() {
  const navigate = useNavigate();
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        username,
        password,
      });

      console.log("Login successful:", response);

      console.log("Login successful:", response);

localStorage.setItem("token", response.token);

alert("Login successful!");

navigate("/");

      alert("Login successful!");

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Shopping API Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
  Don't have an account?{" "}
  <button type="button" onClick={() => navigate("/register")}>
    Register
  </button>
</p>
    </div>
  );
}