import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";

const Cart = () => {
  const location = useLocation();
  const userID = location.state?.userID; // Get userID from state
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items from the database
  useEffect(() => {
    if (!userID) return;
    Axios.get(`http://localhost:5000/cart/${userID}`)
      .then((response) => {
        setCartItems(response.data);
        calculateTotalPrice(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch cart items:", error);
        setCartItems([]); // Set cart to empty in case of error
      });
  }, [userID]);

  // Calculate total price
  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // Handle item removal
  const handleRemoveItem = (productID) => {
    Axios.delete(`http://localhost:5000/cart/${userID}/${productID}`)
      .then(() => {
        const updatedCartItems = cartItems.filter(
          (item) => item.productID !== productID
        );
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);
      })
      .catch((error) => {
        console.error("Failed to remove item:", error);
      });
  };

  // Handle payment and move items to orderHistory
  const handlePay = () => {
    Axios.post(`http://localhost:5000/cart/pay/${userID}`)
      .then((response) => {
        // On success, clear cart and reset total price
        alert(response.data.message); // Success message
        setCartItems([]); // Clear the cart items in the frontend
        setTotalPrice(0); // Reset the total price
      })
      .catch((error) => {
        console.error("Payment failed:", error);
        alert("Payment failed. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 style={{ marginBottom: "50px", fontStyle: "italic" }}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group" style={{ marginBottom: "40px" }}>
            {cartItems.map((item) => (
              <li
                key={item.productID}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 style={{ marginBottom: "20px", marginTop: "10px" }}>
                    {item.name}
                  </h5>
                  <p>
                    Price: <span style={{ color: "green" }}>${item.price}</span>
                  </p>
                  <p>
                    Quantity:{" "}
                    <span style={{ color: "blue" }}>{item.quantity}</span>
                  </p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveItem(item.productID)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3 className="mt-4">
            Total :{" "}
            <span style={{ color: "green" }}>${totalPrice.toFixed(2)}</span>
          </h3>
          <button
            className="btn btn-primary mt-3"
            onClick={handlePay}
            style={{
              padding: "10px 50px",
              borderRadius: "5px",
              fontWeight: "bold",
              letterSpacing: "1.5px",
              margin: "50px 0",
            }}
          >
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
