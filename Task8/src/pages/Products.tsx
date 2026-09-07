import { useEffect, useState } from "react";
import {
  getProducts,
  searchProducts,
  filterProductsByType,
  sortProductsByPrice,
  type Product,
} from "../api/products";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [productType, setProductType] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        if (search.trim()) {
          const data = await searchProducts(search);
          setProducts(data);
          setTotalPages(1);
        } else if (productType) {
          const data = await filterProductsByType(productType);
          setProducts(data);
          setTotalPages(1);
        } else if (sortOrder) {
          const data = await sortProductsByPrice(
            sortOrder as "asc" | "desc",
          );
          setProducts(data);
          setTotalPages(1);
        } else {
          const response = await getProducts(page, limit);
          setProducts(response.data);
          setTotalPages(response.meta.totalPages);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, productType, sortOrder]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearch(event.target.value);
    setProductType("");
    setSortOrder("");
    setPage(1);
  };

  const handleTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setProductType(event.target.value);
    setSearch("");
    setSortOrder("");
    setPage(1);
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSortOrder(event.target.value);
    setSearch("");
    setProductType("");
    setPage(1);
  };

  return (
    <div>
      <h1>Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
      />

      <select value={productType} onChange={handleTypeChange}>
        <option value="">All Types</option>
        <option value="Electronics">Electronics</option>
        <option value="Grocery">Grocery</option>
        <option value="Clothing">Clothing</option>
        <option value="Stationery">Stationery</option>
      </select>

      <select value={sortOrder} onChange={handleSortChange}>
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading &&
        !error &&
        products.map((product) => (
          <div key={product._id}>
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>{product.description}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Type: {product.product_type}</p>
          </div>
        ))}

      {!loading &&
        !error &&
        !search &&
        !productType &&
        !sortOrder &&
        totalPages > 1 && (
          <div>
            <button
              onClick={() => setPage((current) => current - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              {" "}
              Page {page} of {totalPages}{" "}
            </span>

            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
}