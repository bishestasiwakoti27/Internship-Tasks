import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Stores from "./pages/Stores";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/products"
          element={token ? <Products /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/stores"
          element={token ? <Stores /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/checkout"
          element={token ? <Checkout /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/orders"
          element={token ? <Orders /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;