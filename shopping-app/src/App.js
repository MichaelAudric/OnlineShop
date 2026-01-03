import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-history" element={<OrderHistory />} />
        //<Route path="/login" element={<Login />} />
        //<Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
