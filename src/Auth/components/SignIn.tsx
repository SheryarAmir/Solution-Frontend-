"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Note: react-router-dom is not natively supported in Next.js for routing, but kept as per instruction.

// LogoHeader component integrated directly

import heroImage from "../../assets/images/7.jpg";
import final from "../../assets/images/ROS_FINAL-05.png";
import Ros from "../../assets/images/ROS_FINAL-07.png";
function LogoHeader() {
  return (
    <div className="text-center mb-4">
    <div className="flex items-center ">
  <span className="text-2xl font-bold">Welcome to</span>
  <img src={Ros} alt="ROS Logo" width={100} height={29} className="object-contain" />
</div>

      <img src={final} alt="ROS Logo" width={270} height={230} className="" />
    </div>
  );
}

export default function SignIn() {
  const [showDiv, setShowDiv] = useState({
    login: true,
    forgot: false,
    password: false,
    reset: false,
    confirm: false,
    update: false,
  });
  const navigate = useNavigate();

  const loginToMicro = () => {
    // Call your auth service here
    console.log("Login to Micro");
  };

  const dashboard = () => {
    navigate("/dashboard");
  };

  const register = () => {
    navigate("/register");
  };

  const toggleDiv = (current: keyof typeof showDiv) => {
    const newState = {
      login: false,
      forgot: false,
      password: false,
      reset: false,
      confirm: false,
      update: false,
    };
    newState[current] = true;
    setShowDiv(newState);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Restaurant interior"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="overlay absolute inset-0 bg-black/55 z-10" />

      {/* Card container */}
      <div className="absolute top-1/2 right-28 transform -translate-y-1/2 w-[305px] h-[337px] bg-white rounded-xl shadow-xl z-20 p-6 flex flex-col justify-between">
        {/* LOGIN */}
        {showDiv.login && (
          <div className="flex flex-col items-center justify-center h-full ">
            <LogoHeader />
            <div className="mt-4">
              <button
                type="button"
                className="w-[180px] h-10 bg-primary_blue text-white font-medium text-base rounded-md bg-blue-500"
                onClick={loginToMicro}
              >
                LOGIN
              </button>
            </div>
          </div>
        )}

        {/* FORGOT */}
        {showDiv.forgot && (
          <div className="flex flex-col h-full">
            <LogoHeader />
            <div className="px-2 flex-grow">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary_blue focus:border-primary_blue outline-none"
              />
            </div>
            <div className="text-center mt-4">
              <button
                className="w-[180px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
                onClick={() => toggleDiv("password")}
              >
                RESET PASSWORD
              </button>
              <div className="mt-3">
                <button
                  className="w-[180px] h-10 text-primary_blue font-medium text-base rounded-md hover:bg-primary_blue/10"
                  onClick={dashboard}
                >
                  LOGIN
                </button>
              </div>
            </div>
            <div className="mt-auto text-left pt-4">
              <small className="opacity-50 text-sm">
                Don't have an account?
              </small>
              <button
                className="ml-2 w-[85px] text-primary_blue text-sm font-semibold hover:bg-primary_blue/10"
                onClick={register}
              >
                SIGN UP
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD RESET MESSAGE */}
        {showDiv.password && (
          <div className="text-center flex flex-col h-full">
            <LogoHeader />
            <div className="flex-grow flex flex-col justify-center items-center space-y-1">
              <p className="text-lg font-bold">Your password has been</p>
              <p className="text-lg font-bold">updated</p>
              <p className="text-lg font-bold">successfully</p>
            </div>
            <div className="mt-4">
              <button
                className="w-[180px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
                onClick={() => toggleDiv("reset")}
              >
                CHANGE PASSWORD
              </button>
            </div>
            <div className="mt-auto text-left pt-4">
              <small className="opacity-50 text-sm">
                Don't have an account?
              </small>
              <button
                className="ml-2 w-[85px] text-primary_blue text-sm font-semibold hover:bg-primary_blue/10"
                onClick={register}
              >
                SIGN UP
              </button>
            </div>
          </div>
        )}

        {/* RESET PASSWORD FORM */}
        {showDiv.reset && (
          <div className="flex flex-col h-full">
            <LogoHeader />
            <div className="px-2 space-y-4 flex-grow">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary_blue focus:border-primary_blue outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary_blue focus:border-primary_blue outline-none"
              />
            </div>
            <div className="text-center mt-4">
              <button
                className="w-[180px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
                onClick={() => toggleDiv("confirm")}
              >
                CHANGE PASSWORD
              </button>
            </div>
          </div>
        )}

        {/* CONFIRMATION */}
        {showDiv.confirm && (
          <div className="text-center flex flex-col h-full">
            <LogoHeader />
            <div className="flex-grow flex flex-col justify-center items-center space-y-1">
              <p className="text-lg font-bold">Your password has been</p>
              <p className="text-lg font-bold">updated</p>
              <p className="text-lg font-bold">successfully</p>
            </div>
            <div className="mt-4">
              <button
                className="w-[180px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
                onClick={() => {
                  dashboard();
                  toggleDiv("login");
                }}
              >
                LOGIN
              </button>
            </div>
            <div className="mt-4 text-sm opacity-50">Forgot password?</div>
            <div className="mt-auto text-left pt-4">
              <small className="opacity-50 text-sm">
                Don't have an account?
              </small>
              <button
                className="ml-2 w-[85px] text-primary_blue text-sm font-semibold hover:bg-primary_blue/10"
                onClick={register}
              >
                SIGN UP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
