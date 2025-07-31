"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // Note: react-router-dom is not natively supported in Next.js for routing, but kept as per instruction.

// LogoHeader component integrated directly
import Ros from "../../assets/images/ROS_FINAL-07.png";
import pexels from"../../assets/images/pexels-anete-lusina-5721015.jpg"
// import SignIn from "./SignIn";
import OtpInput from "./_component/OtpInput";
import ForgotPassword from "./_component/ForgotPassword";


// LogoHeader component integrated directly
function LogoHeader() {
  return (
    <div className="text-center mb-6">
      <p className="text-xl font-normal text-gray-800">
        <span className="text-2xl font-bold">Welcome to </span>
        <img
          src={Ros}
          alt="ROS Logo"
          width={85}
          height={50}
          className="inline-block h-7 w-auto mt-[-5px] ml-[-12px] align-middle"
        />
      </p>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [showDiv, setShowDiv] = useState({
    signup: true,
    otp: false,
    verify: false,
    reset: false,
    confirm: false,
    update: false,
  })

  const [activeModule, setActiveModule] = useState<string | null>(null)
  

  const dashboard = () => {
    navigate("/dashboard")
  }

   const login = () => {
    navigate("/SignIn");
  };
  const toggleDiv = (current: keyof typeof showDiv) => {
    const newState = {
      signup: false,
      otp: false,
      verify: false,
      reset: false,
      confirm: false,
      update: false,
    }
    newState[current] = true
    setShowDiv(newState)
  }

  const handleModuleClick = (moduleName: string) => {
    setActiveModule(activeModule === moduleName ? null : moduleName)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={pexels}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="overlay absolute inset-0 bg-black/55 z-10" />

      {/* Card container */}
      <div className="absolute top-1/2 left-[10%] transform -translate-y-1/2 w-[650px] h-[550px] bg-white rounded-xl shadow-xl z-20 p-6 flex flex-col">
        {/* SIGNUP Form */}
        {showDiv.signup && (
          <div className="flex flex-col h-full">
            <LogoHeader />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-4">
              <div className="relative">
                <input
                placeholder="fRIST Name"
                  id="firstName"
                  type="text"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800"
                />
              </div>
              <div className="relative ">
                
                <input
                placeholder="Last Name"
                  id="lastName"
                  type="text"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800"
                />
              </div>
              <div className="relative">
                
                <input
                 placeholder="Bussiness Name"
                  id="businessName"
                  type="text"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800"
                />
              </div>
              <div className="relative">
                
                <select
               
                  id="country"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800 bg-white appearance-none pr-6"
                >
                    <option value="one">Country</option>
                  <option value="one">USA</option>
                  <option value="two">Europe</option>
                  <option value="three">UK</option>
                  <option value="four">England</option>
                  <option value="five">India</option>
                  <option value="six">Canada</option>
                  <option value="seven">Australia</option>
                  <option value="eight">Africa</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                
                <input
                placeholder="Email"
                  id="email"
                  type="email"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800"
                />
              </div>
              <div className="relative">
                
                <input
                placeholder="Phone Number"
                  id="phoneNumber"
                  type="text"
                  className="w-full border-b border-gray-300 pb-1 focus:border-primary_blue outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Select Modules */}
            <div className="text-center mb-4 mt-4">
              <p className="font-bold text-gray-800">Select Modules for Demo</p>
            </div>
            <div className="grid grid-cols-4 gap-2 justify-items-center">
              {/* Cash Management */}
              <div
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 p-2 rounded-full ${
                  activeModule === "cash" ? "bg-[#C0FCC4]" : ""
                }`}
                onClick={() => handleModuleClick("cash")}
              >
                <svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" opacity="0.5">
                  <g id="Group_1196" data-name="Group 1196" transform="translate(-129 -442)">
                    <g id="Group_1195" data-name="Group 1195" transform="translate(138 454)">
                      <rect
                        id="Rectangle_236"
                        data-name="Rectangle 236"
                        width="20"
                        height="15"
                        rx="2"
                        transform="translate(5.193 5)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        id="Path_258"
                        data-name="Path 258"
                        d="M22.984,10.346V7.855A2.855,2.855,0,0,0,20.129,5H5.855A2.855,2.855,0,0,0,3,7.855v8.565a2.855,2.855,0,0,0,2.855,2.855H8.306"
                        transform="translate(-3 -5)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                    <path
                      id="Icon_metro-dollar2"
                      data-name="Icon metro-dollar2"
                      d="M15.406,9.123a2.222,2.222,0,0,1-.581,1.539,2.508,2.508,0,0,1-1.51.8v1.022a.18.18,0,0,1-.187.187H12.34a.189.189,0,0,1-.187-.187V11.459a3.681,3.681,0,0,1-.745-.181,3.586,3.586,0,0,1-1.025-.54,3.328,3.328,0,0,1-.272-.219q-.073-.07-.1-.105A.177.177,0,0,1,10,10.174l.6-.788a.182.182,0,0,1,.134-.07.145.145,0,0,1,.14.053l.012.012a3.049,3.049,0,0,0,1.419.73,2.04,2.04,0,0,0,.432.047,1.416,1.416,0,0,0,.832-.251.818.818,0,0,0,.359-.712.592.592,0,0,0-.088-.309,1.094,1.094,0,0,0-.2-.245A1.6,1.6,0,0,0,13.3,8.42q-.234-.12-.385-.187t-.467-.19L12.092,7.9q-.131-.053-.359-.155t-.365-.181q-.137-.079-.33-.207a2.056,2.056,0,0,1-.312-.248,3.64,3.64,0,0,1-.254-.286,1.429,1.429,0,0,1-.207-.339,2.342,2.342,0,0,1-.123-.388,2.027,2.027,0,0,1-.05-.455,2,2,0,0,1,.572-1.413,2.672,2.672,0,0,1,1.489-.782V2.39A.189.189,0,0,1,12.34,2.2h.788a.18.18,0,0,1,.187.187V3.418a3.248,3.248,0,0,1,.645.134,3.741,3.741,0,0,1,.508.2,2.814,2.814,0,0,1,.371.219q.175.123.228.169t.088.082a.169.169,0,0,1,.029.222l-.473.853a.159.159,0,0,1-.134.093.186.186,0,0,1-.158-.041q-.018-.018-.085-.07t-.228-.155a3.014,3.014,0,0,0-.342-.187,2.608,2.608,0,0,0-.435-.152,1.948,1.948,0,0,0-.5-.067,1.518,1.518,0,0,0-.905.251.785.785,0,0,0-.3.928.657.657,0,0,0,.172.242,2.573,2.573,0,0,0,.231.193,2.057,2.057,0,0,0,.327.181q.219.1.353.158t.409.161q.309.117.473.184t.444.2a3.528,3.528,0,0,1,.441.248,3.728,3.728,0,0,1,.362.292,1.512,1.512,0,0,1,.309.371,2.116,2.116,0,0,1,.184.447,1.926,1.926,0,0,1,.076.549Z"
                      transform="translate(141.987 459.719)"
                    />
                    <g
                      id="Ellipse_19"
                      data-name="Ellipse 19"
                      transform="translate(129 442)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <circle cx="22" cy="22" r="22" stroke="none" />
                      <circle cx="22" cy="22" r="21" fill="none" />
                    </g>
                  </g>
                </svg>
                <p className="text-xs text-gray-700 opacity-50 mt-1">Cash Management</p>
              </div>

              {/* HR Management */}
              <div
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 p-2 rounded-full ${
                  activeModule === "hr" ? "bg-[#C0FCC4]" : ""
                }`}
                onClick={() => handleModuleClick("hr")}
              >
                <svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" opacity="0.5">
                  <g id="Group_1197" data-name="Group 1197" transform="translate(-130 -443)">
                    <g
                      id="Ellipse_19"
                      data-name="Ellipse 19"
                      transform="translate(130 443)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <circle cx="22" cy="22" r="22" stroke="none" />
                      <circle cx="22" cy="22" r="21" fill="none" />
                    </g>
                    <g id="Group_1200" data-name="Group 1200" transform="translate(140 453)">
                      <path id="Path_259" data-name="Path 259" d="M0,0H24V24H0Z" fill="none" />
                      <circle
                        id="Ellipse_20"
                        data-name="Ellipse 20"
                        cx="4"
                        cy="4"
                        r="4"
                        transform="translate(5 3)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        id="Path_260"
                        data-name="Path 260"
                        d="M3,21V19a4,4,0,0,1,4-4h4a4,4,0,0,1,4,4v2"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        id="Path_261"
                        data-name="Path 261"
                        d="M16,3.13a4,4,0,0,1,0,7.75"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        id="Path_262"
                        data-name="Path 262"
                        d="M21,21V19a4,4,0,0,0-3-3.85"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                  </g>
                </svg>
                <p className="text-xs text-gray-700 opacity-50 mt-1">HR Management</p>
              </div>

              {/* Inventory Management */}
              <div
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 p-2 rounded-full ${
                  activeModule === "inventory" ? "bg-[#C0FCC4]" : ""
                }`}
                onClick={() => handleModuleClick("inventory")}
              >
                <svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" opacity="0.5">
                  <g id="Group_1198" data-name="Group 1198" transform="translate(-130 -443)">
                    <g
                      id="Ellipse_19"
                      data-name="Ellipse 19"
                      transform="translate(130 443)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <circle cx="22" cy="22" r="22" stroke="none" />
                      <circle cx="22" cy="22" r="21" fill="none" />
                    </g>
                    <g id="Group_1201" data-name="Group 1201" transform="translate(140 453)">
                      <path id="Path_263" data-name="Path 263" d="M0,0H24V24H0Z" fill="none" />
                      <path
                        id="Path_264"
                        data-name="Path 264"
                        d="M12,3l8,4.5v9L12,21,4,16.5v-9L12,3"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <line
                        id="Line_66"
                        data-name="Line 66"
                        y1="4.5"
                        x2="8"
                        transform="translate(12 7.5)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <line
                        id="Line_67"
                        data-name="Line 67"
                        y2="9"
                        transform="translate(12 12)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <line
                        id="Line_68"
                        data-name="Line 68"
                        x1="8"
                        y1="4.5"
                        transform="translate(4 7.5)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <line
                        id="Line_69"
                        data-name="Line 69"
                        x1="8"
                        y2="4.5"
                        transform="translate(8 5.25)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                  </g>
                </svg>
                <p className="text-xs text-gray-700 opacity-50 mt-1">Inventory Management</p>
              </div>

              {/* Reports & Analysis */}
              <div
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 p-2 rounded-full ${
                  activeModule === "reports" ? "bg-[#C0FCC4]" : ""
                }`}
                onClick={() => handleModuleClick("reports")}
              >
                <svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" opacity="0.5">
                  <g id="Group_1199" data-name="Group 1199" transform="translate(-130 -443)">
                    <g
                      id="Ellipse_19"
                      data-name="Ellipse 19"
                      transform="translate(130 443)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <circle cx="22" cy="22" r="22" stroke="none" />
                      <circle cx="22" cy="22" r="21" fill="none" />
                    </g>
                    <g id="Group_1202" data-name="Group 1202" transform="translate(140 453)">
                      <path id="Path_265" data-name="Path 265" d="M0,0H24V24H0Z" fill="none" />
                      <rect
                        id="Rectangle_237"
                        data-name="Rectangle 237"
                        width="6"
                        height="8"
                        rx="1"
                        transform="translate(3 12)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <rect
                        id="Rectangle_238"
                        data-name="Rectangle 238"
                        width="6"
                        height="12"
                        rx="1"
                        transform="translate(9 8)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <rect
                        id="Rectangle_239"
                        data-name="Rectangle 239"
                        width="6"
                        height="16"
                        rx="1"
                        transform="translate(15 4)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <line
                        id="Line_70"
                        data-name="Line 70"
                        x2="14"
                        transform="translate(4 20)"
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                  </g>
                </svg>
                <p className="text-xs text-gray-700 opacity-50 mt-1">Reports & Analysis</p>
              </div>
            </div>

            {/* Get OTP Button */}
            <div className="text-center mt-8">
              <button
                className="w-[200px] h-10 bg-primary_blue text-white  font-medium text-base rounded-md bg-blue-500"
                onClick={() => toggleDiv("otp")}
              >
                GET OTP
              </button>
            </div>

            {/* Login Button */}
            <div className="mt-auto text-center pt-4">
              <p className="text-sm opacity-50 inline-block">Have an account?</p>
              <button
                className="ml-2 w-[100px] h-10 bg-primary_blue text-white font-medium text-base rounded-md bg-blue-500"
                onClick={login}
              >
                LOGIN
              </button>
            </div>
          </div>
        )}

        {/* OTP Screen */}
        {showDiv.otp && (
          <>
            <OtpInput
              onVerify={() => toggleDiv("verify")}
              onLogin={login}
            />
            <div className="text-center mt-2">
              <button
                className="text-blue-600 underline text-sm"
                onClick={() => toggleDiv("reset")}
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {/* Sign-UP successful Screen */}
        {showDiv.verify && (
          <div className="flex flex-col h-full">
            <LogoHeader />
            <div className="flex-grow flex flex-col justify-center items-center text-center space-y-1">
              <p className="text-lg font-bold">You have successfully registered for ROS</p>
              <p className="text-lg font-bold">Portal. Please wait till your representatives</p>
              <p className="text-lg font-bold">contact you.</p>
            </div>
            <div className="text-center mt-4">
              <button
                className="w-[160px] h-10 bg-primary_blue text-white font-medium text-base rounded-md bg-blue-500"
                onClick={login}
              >
                BACK TO HOME
              </button>
            </div>
            <div className="mt-auto text-center pt-4">
              <p className="text-sm opacity-50 inline-block">Have an account?</p>
              <button
                className="ml-2 w-[100px] h-10 bg-primary_blue text-white font-medium text-base rounded-md bg-blue-500"
                onClick={login}
              >
                LOGIN
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Screen */}
        {showDiv.reset && (
          <ForgotPassword
            onSendOtp={() => toggleDiv("otp")}
            onLogin={login}
          />
        )}
      </div>
    </div>
  )
}

