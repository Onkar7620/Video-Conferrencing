import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import API from "../../Api/Api.js";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate=useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try{
        const res=await axios.post("http://localhost:8080/api/auth/login",{email: loginData.email, password: loginData.password},
          {withCredentials: true,}
        );
        if(res.data.success){
          navigate("/dashboard");
        }
    }catch(err){
          console.log(err)
    };
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try{
        const res=await axios.post("http://localhost:8080/api/auth/register",{name: signupData.name, email: signupData.email, password: signupData.password},
          {withCredentials: true,}
        );
        if(res.data.success){
          navigate("/dashboard");
        }

    }catch(err){
        console.error("Signup Error:", err);
    }
     

  };

  const handleGoogleLogin = () => {
    console.log("Google Login Clicked");
    
    // Firebase Google Authentication Here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Tabs */}
        <div className="flex bg-gray-100">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 font-semibold transition-all duration-300 ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 font-semibold transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-2">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-center text-gray-500 mb-6">
            {activeTab === "login"
              ? "Login to continue"
              : "Sign up to get started"}
          </p>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Bottom Switch */}
          <div className="text-center mt-6">
            {activeTab === "login" ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;