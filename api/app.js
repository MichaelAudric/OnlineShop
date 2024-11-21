const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

// Allow requests from your frontend domain
const corsOptions = {
  origin: "https://online-shop-rho-one.vercel.app", // Frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mckmck3.",
  database: "online_shop",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

// Endpoint to get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint to get a specific product by ID
app.get("/product/:id", (req, res) => {
  const productId = req.params.id;
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    }
  );
});

// Endpoint to get all orders for a customer (replace with user authentication later)
app.get("/orders", (req, res) => {
  const customerName = req.query.customer_name; // Placeholder for user-specific orders

  const query = `
    SELECT o.id, o.date, oi.product_id, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.customer_name = ?
    ORDER BY o.date DESC
  `;

  db.query(query, [customerName], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Register endpoint
app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  // Check for required fields
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: "Username, password, and email are required.",
    });
  }

  // Check if username already exists
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking username:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    // If the username is taken, return a conflict error
    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username already taken." });
    }

    // Insert new user into the database
    const insertQuery =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    db.query(insertQuery, [username, password, email], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error." });
      }

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required." });
  }

  // Check if the user exists with the provided username and password
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error." });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password." });
      }

      // Login successful
      res.json({
        success: true,
        message: "Login successful!",
        user: results[0],
      });
    }
  );
});

//Logout endpoint
app.post("/logout", (req, res) => {
  res.json({
    message: "Logout successful!",
  });
});

// Add product to cart or update quantity if it already exists
app.post("/cart", (req, res) => {
  const { userId, productId, quantity } = req.body;

  // First, check if the product already exists in the user's cart
  const checkQuery = `
    SELECT * FROM cart WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkQuery, [userId, productId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking cart");
    }

    if (results.length > 0) {
      // If product exists, update the quantity
      const newQuantity = results[0].quantity + quantity;
      const updateQuery = `
        UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?
      `;
      db.query(
        updateQuery,
        [newQuantity, userId, productId],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error updating cart");
          }
          res.send("Product quantity updated in cart");
        }
      );
    } else {
      // If product does not exist, insert a new entry
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)
      `;
      db.query(insertQuery, [userId, productId, quantity], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error adding product to cart");
        }
        res.send("Product added to cart successfully");
      });
    }
  });
});

app.get("/cart/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  const query = `
      SELECT c.id AS cart_id, p.name, p.description, p.price, c.quantity, p.id AS productID
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching cart");
    }
    res.send(results);
  });
});

app.delete("/cart/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;

  const query = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], (err, results) => {
    if (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).send("Error deleting cart item");
    }
    if (results.affectedRows > 0) {
      res.send("Item removed from cart successfully");
    } else {
      res.status(404).send("Item not found in cart");
    }
  });
});

// Handle payment and move items to orderHistory
app.post("/cart/pay/:userID", (req, res) => {
  const userID = req.params.userID;

  // Fetch all items in the cart for the user
  const query = `
    SELECT * FROM cart WHERE user_id = ?
  `;
  db.query(query, [userID], (err, cartItems) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching cart items" });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty, cannot proceed with payment.",
      });
    }

    // Move each item to orderHistory
    const insertQuery = `
      INSERT INTO orderHistory (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `;
    cartItems.forEach((item) => {
      db.query(
        insertQuery,
        [item.user_id, item.product_id, item.quantity],
        (err) => {
          if (err) {
            console.error("Error inserting into orderHistory:", err);
            return res
              .status(500)
              .json({ success: false, message: "Error processing payment." });
          }
        }
      );
    });

    // Clear the cart after moving items
    const deleteQuery = `
      DELETE FROM cart WHERE user_id = ?
    `;
    db.query(deleteQuery, [userID], (err) => {
      if (err) {
        console.error("Error clearing cart:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error clearing cart." });
      }

      res.json({
        success: true,
        message: "Payment successful! Items moved to orderHistory.",
      });
    });
  });
});

// Endpoint to fetch order history
app.get("/orderHistory/:userID", (req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT * FROM orderHistory WHERE user_id = ?
  `;

  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching order history:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching order history." });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this user.",
      });
    }

    res.json(results);
  });
});

// Export the app for Vercel to handle
module.exports = app;
