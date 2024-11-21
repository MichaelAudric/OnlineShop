import React, { useEffect, useState } from "react";
import Axios from "axios";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import "../bootstrap-4.0.0-dist/css/bootstrap.min.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loggedInUserID, setLoggedInUserID] = useState(null); // Track the logged-in user's ID

  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch products
  useEffect(() => {
    Axios.get("https://online-shop.vercel.app/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    Axios.post("https://online-shop.vercel.app/api/login", {
      username,
      password,
    })
      .then((response) => {
        if (response.data.success) {
          setIsLoggedIn(true); // Set login status to true
          setLoggedInUserID(response.data.user.id); // Store the user ID from the login response
          alert("Login successful!");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed");
      });
  };

  // Handle registration
  const handleRegister = (e) => {
    e.preventDefault();
    Axios.post("https://online-shop.vercel.app/api/register", {
      username,
      password,
      email,
    })
      .then((response) => {
        if (response.data.success) {
          alert("Registration successful! You can now log in.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Registration failed");
      });
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login status to false
    setLoggedInUserID(null); // Clear the user ID on logout
    setUsername("");
    setPassword("");
    setEmail("");
    alert("Logged out successfully!");
  };

  // Redirect to Order History page
  const handleGoToOrderHistory = () => {
    navigate("/order-history", { state: { userID: loggedInUserID } }); // Navigate to the order history page
  };

  // Redirect to Cart page
  const handleGoToCart = () => {
    navigate("/cart", { state: { userID: loggedInUserID } }); // Pass the userID as state
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="/"
            style={{
              fontSize: "32px",
              fontStyle: "italic",
              fontWeight: "450",
              color: "darkslategray",
            }}
          >
            Mike's shop
          </a>
          <div>
            {isLoggedIn ? (
              <>
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={handleLogout}
                  style={{ marginLeft: "20px" }}
                >
                  Logout
                </button>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handleGoToOrderHistory}
                  style={{ marginLeft: "20px" }}
                >
                  Order History
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={handleGoToCart}
                  style={{ marginLeft: "20px" }}
                >
                  Cart
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {!isLoggedIn ? (
        <div className="row" style={{}}>
          <div className="col-md-6">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Register
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ margin: "80px 0", color: "grey" }}>
            Explore Our Latest Deals and Offers :
          </h2>
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-4 mb-3">
                <ProductCard product={product} userID={loggedInUserID} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
