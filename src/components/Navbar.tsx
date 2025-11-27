import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand / Logo */}
        <Link to="/" className="brand">
          Ecommex Test
        </Link>

        {/* Navigation links */}
        <nav className="nav-links">
          <Link to="/cart" className="nav-item">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
