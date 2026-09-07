import { useEffect, useState } from "react";
import { getOrders, type Order } from "../api/orders";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrders();
        setOrders(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load order history",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order History</h1>

      {loading && <p>Loading orders...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {!loading &&
        !error &&
        orders.map((order) => (
          <div key={order._id}>
            <h2>Order #{order._id}</h2>

            <p>
              Customer: {order.customer_name}
            </p>

            <p>
              Total: Rs. {order.totalPrice}
            </p>

            {order.createdAt && (
              <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            )}

            <h3>Products</h3>

            {order.products.map((item, index) => (
              <p key={index}>
                Product ID: {item.productId} — Quantity:{" "}
                {item.quantity}
              </p>
            ))}
          </div>
        ))}
    </div>
  );
}