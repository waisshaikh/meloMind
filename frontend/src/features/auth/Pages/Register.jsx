import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/login.css"; 

const Register = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

        <h1 className="title">Register</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <button type="submit">Register</button>

        </form>

        <p className="switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;