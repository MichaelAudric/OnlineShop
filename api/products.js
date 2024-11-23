const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

// Database connection setup
const db = mysql.createConnection({
  host: "bdpmeutrazyxffyqpytz-mysql.services.clever-cloud.com",
  user: "uawdtogdhwsbypem",
  password: "4KBDh3cNZPRhGcar8kSK",
  database: "bdpmeutrazyxffyqpytz",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Vercel serverless function handler for /products
module.exports = (req, res) => {
  // Enable CORS
  cors({
    origin: "https://online-shop-rho-one.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })(req, res, () => {});

  bodyParser.json()(req, res, () => {});

  // Handle GET request to /products
  if (req.method === "GET") {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) {
        res.status(500).json({ error: "Database query failed" });
        return;
      }
      res.status(200).json(results);
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
