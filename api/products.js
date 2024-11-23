const mysql = require("mysql");

// Database connection setup
const db = mysql.createConnection({
  host: "bdpmeutrazyxffyqpytz-mysql.services.clever-cloud.com",
  user: "uawdtogdhwsbypem",
  password: "4KBDh3cNZPRhGcar8kSK",
  database: "bdpmeutrazyxffyqpytz",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }
  console.log("MySQL Connected...");
});

// Serverless function for products
module.exports = async (req, res) => {
  if (req.method === "GET") {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) {
        res.status(500).json({ error: "Database query failed" });
        return;
      }
      res.status(200).json(results);
    });
  } else {
    // Handle unsupported methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
