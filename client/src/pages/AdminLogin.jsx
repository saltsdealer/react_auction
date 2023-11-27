import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";

const AdminLogin = () => {
  const [inputs, setInputs] = useState({
    password: "",
    adminName: "",
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate(); // this isn't working , and I don't know why yet
  const { adminLogin } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(inputs);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <div className="auth">
      <h1>Admin Login</h1>
      <form>
        <input
          required
          type="text"
          placeholder="admin name"
          name="adminName"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Login</button>
        {err && <p>{err} </p>}
      </form>
    </div>
  );
};

export default AdminLogin;
