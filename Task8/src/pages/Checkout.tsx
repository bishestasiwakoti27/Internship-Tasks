import { useState } from "react";
import { createOrder } from "../api/orders";

export default function Checkout() {
  const [customerName, setCustomerName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await createOrder({
        customer_name: customerName,
        products: [
          {
            productId,
            quantity,
          },
        ],
      });

      setMessage(response.message);

      setCustomerName("");
      setProductId("");
      setQuantity(1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name</label>
          <br />
          <input
            type="text"
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Product ID</label>
          <br />
          <input
            type="text"
            value={productId}
            onChange={(event) =>
              setProductId(event.target.value)
            }
            placeholder="Enter product ID"
            required
          />
        </div>

        <br />

        <div>
          <label>Quantity</label>
          <br />
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(Number(event.target.value))
            }
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}
    </div>
  );
}