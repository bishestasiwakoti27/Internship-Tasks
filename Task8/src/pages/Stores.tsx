import { useEffect, useState } from "react";
import {
  getStores,
  getNearbyStores,
  type Store,
} from "../api/stores";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStores();
        setStores(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load stores",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const findNearbyStores = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setNearbyLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { longitude, latitude } = position.coords;

          const response = await getNearbyStores(
            longitude,
            latitude,
          );

          setStores(response.data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to find nearby stores",
          );
        } finally {
          setNearbyLoading(false);
        }
      },
      () => {
        setError("Location permission was denied.");
        setNearbyLoading(false);
      },
    );
  };

  return (
    <div>
      <h1>Stores</h1>

      <button
        onClick={findNearbyStores}
        disabled={nearbyLoading}
      >
        {nearbyLoading
          ? "Finding Nearby Stores..."
          : "Find Nearby Stores"}
      </button>

      {loading && <p>Loading stores...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && stores.length === 0 && (
        <p>No stores found.</p>
      )}

      {!loading &&
        stores.map((store) => (
          <div key={store._id}>
            {store.logo && (
              <img
                src={store.logo}
                alt={store.name}
                width="100"
              />
            )}

            <h2>{store.name}</h2>
            <p>Type: {store.type}</p>

            <p>
              Location:{" "}
              {store.location.coordinates[1]},{" "}
              {store.location.coordinates[0]}
            </p>
          </div>
        ))}
    </div>
  );
}