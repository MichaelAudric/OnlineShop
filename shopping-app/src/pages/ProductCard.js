import React, { useState } from "react";
import Axios from "axios";

const ProductCard = ({ product, userID }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [message, setMessage] = useState(""); // State for success/failure messages

  const handleAddToCart = () => {
    if (quantity < 1) {
      setMessage("Quantity must be at least 1.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    Axios.post("http://online-shop.vercel.app/api/cart", {
      userId: userID, // Pass the userID
      productId: product.id,
      quantity: quantity, // Pass the selected quantity
    })
      .then(() => {
        setMessage("Product added to cart successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear the message after 3 seconds
      })
      .catch((error) => {
        console.error("Failed to add product to cart:", error);
        setMessage("Failed to add product to cart.");
        setTimeout(() => setMessage(""), 3000); // Clear the message after 3 seconds
      });
  };

  return (
    <div
      className="product-card"
      style={{
        backgroundColor: "whitesmoke",
        padding: "20px 25px",
        borderRadius: "10px",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "grey" }}>{product.name}</h3>
      <p style={{ color: "green" }}>${product.price}</p>
      {/* Quantity Input */}
      <div style={{ margin: "50px 0" }}>
        <label
          htmlFor={`quantity-${product.id}`}
          style={{ marginRight: "15px" }}
        >
          Quantity :
        </label>
        <input
          type="number"
          id={`quantity-${product.id}`}
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))} // Update quantity
          style={{
            borderRadius: "5px",
            padding: "2px",
            border: "1px solid grey",
          }}
        />
      </div>
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        type="button"
        class="btn btn-light"
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          padding: "10px 30px",
          borderRadius: "30px",
          color: "grey",
        }}
      >
        Add to Cart
      </button>
      {message && <p>{message}</p>} {/* Display success/failure messages */}
    </div>
  );
};

export default ProductCard;
