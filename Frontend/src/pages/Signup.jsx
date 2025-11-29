import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const existingUser = JSON.parse(localStorage.getItem("user"));

    if (existingUser && existingUser.mobile === mobile) {
      toast.error("User already registered with this mobile number!");
      return;
    }

    const user = { name, mobile, password };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    toast.success("Signup successful! You are now logged in.");
    navigate("/main"); // Redirect to main page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200">
      <Navbar solidBackground={true} />
      <div className="flex justify-center items-center h-[calc(100vh-80px)] px-4 pt-20">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <div className="mb-4">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label>Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={10}
              required
              className="w-full px-4 py-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded mt-2"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="text-purple-600 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
