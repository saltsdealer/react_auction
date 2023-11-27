import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/logo.png";
import { AuthContext } from "../context/authContext.js";

const Navbar = () => {
  const { currentUser, adminLogout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/admin">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/admin/user">
            <h6>DeleteUser</h6>
          </Link>
          <Link className="link" to="/admin/product">
            <h6>DeleteProduct</h6>
          </Link>
          <Link className="link" to="/admin/statistics">
            <h6>Statistics</h6>
          </Link>

          {currentUser ? (
            <>
              <h6>{currentUser.admin_name}</h6>
              <span onClick={adminLogout}>Logout</span>
            </>
          ) : (
            <Link className="link" to="/admin/login">
              AdminLogin
            </Link>
          )}

          <span className="post">
            <Link className="link" to="/admin/home">
              Home
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
