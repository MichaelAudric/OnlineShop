import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";

const OrderHistory = () => {
  const location = useLocation();
  const userID = location.state?.userID; // Get userID from state
  const [orderHistory, setOrderHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch order history from the backend
  useEffect(() => {
    if (!userID) return;

    Axios.get(`http://localhost:5000/orderHistory/${userID}`)
      .then((response) => {
        setOrderHistory(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch order history:", error);
        setErrorMessage("Failed to fetch order history.");
      });
  }, [userID]);

  return (
    <div className="container mt-5">
      <h2 style={{ marginBottom: "50px" }}> Order History</h2>
      {errorMessage && <p>{errorMessage}</p>}
      {orderHistory.length === 0 ? (
        <p>You have no order history.</p>
      ) : (
        <div>
          <ul className="list-group">
            {orderHistory.map((item) => (
              <li
                key={`${item.product_id}-${item.order_id}`} // Assuming each order has a unique order_id
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 style={{ margin: "15px 0" }}>
                    Product ID : {item.product_id}
                  </h5>
                  <p>
                    Quantity:{" "}
                    <span style={{ color: "blue" }}>{item.quantity}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
