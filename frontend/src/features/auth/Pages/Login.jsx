import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/login.css";

const Login = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="form-cont">
      <div className="form">

        <h1 className="title">Login</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>

        </form>

        <p className="switch">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login; 