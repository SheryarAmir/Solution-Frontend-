import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rosLogo7 from '../../assets/images/ROS_FINAL-07.png';
import rosLogo5 from '../../assets/images/ROS_FINAL-05.png';
import bgImage from '../../assets/images/7.jpg';
import LogoHeader from './_component/LogoHeader';
import ForgotPassword from './_component/ForgotPassword';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [showDiv, setShowDiv] = useState({
    login: true,
    forgot: false,
    password: false,
    reset: false,
    confirm: false,
    update: false,
  });
  const [showWelcome, setShowWelcome] = useState(true);

  // Form state (for demonstration, not functional)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stubbed login logic
  const loginToMicro = () => {
    // TODO: Connect to your auth logic
    setShowDiv({ ...showDiv, login: false });
    navigate('/dashboard');
  };

  const dashboard = () => {
    navigate('/dashboard');
  };

  const register = () => {
    navigate('/register');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {showWelcome ? (
        <div className="absolute top-1/2 right-28 transform -translate-y-10/12 w-[305px] h-[337px] bg-white rounded-xl shadow-xl z-20 p-6 flex flex-col">
          <LogoHeader/>
          <div className='flex justify-center items-center mt-7'>
          <button
            className="w-40 h-10 bg-primary_blue text-white font-medium text-base rounded-md bg-[#009fe3] cursor-pointer"
            onClick={() => setShowWelcome(false)}
          >
            Login
          </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Login Card */}
          {showDiv.login && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-4">
                <p className="text-2xl font-normal">
                  <span className="text-2xl font-bold">Welcome to </span>
                  <img src={rosLogo7} alt="Logo" className="inline-block align-middle w-20 h-12 ml-[-14px] mt-[-5px]" />
                </p>
              </div>
              <div className="text-center mb-6">
                <img src={rosLogo5} alt="Logo" className="w-full ml-[-14px] mt-[-18px]" />
              </div>
              <form onSubmit={e => { e.preventDefault(); loginToMicro(); }}>
                <div className="mb-4">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className=" mt-2">
              <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => setShowDiv({ ...showDiv, login: false, forgot: true })}
                >
                  <i className="fas fa-question-circle mr-1"></i>Forgot password?
                </button>
              </div>

                <div className="text-center mb-2">
                  <button
                    type="submit"
                    className="btn btn-sm btn-dark w-32 bg-[#009fe3] text-white py-2 rounded hover:bg-gray-800 transition"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <p className="text-start text-sm">
                  Don't have an account?
                  <button
                    className="ml-2 btn btn-sm btn-dark w-20 bg-black text-white py-1 rounded hover:bg-gray-800 transition"
                    onClick={register}
                  >
                    SIGN UP
                  </button>
                </p>
              </div>
            </div>
          )}
          {/* Forgot Password Card */}
          {showDiv.forgot && (
            <ForgotPassword
              onSendOtp={() => setShowDiv({ ...showDiv, forgot: false, password: true, login: false })}
              onLogin={() => setShowDiv({ ...showDiv, forgot: false, login: true })}
            />
          )}
          {/* Password Request Card */}
          {showDiv.password && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-4">
                <p className="text-2xl font-normal">
                  <span className="text-2xl font-bold">Welcome to </span>
                  <img src={rosLogo7} alt="Logo" className="inline-block align-middle w-20 h-12 ml-[-14px] mt-[-5px]" />
                </p>
              </div>
              <div className="text-center mb-6">
                <img src={rosLogo5} alt="Logo" className="w-full ml-[-14px] mt-[-18px]" />
              </div>
              <div className="mb-4 text-center">
                <b>Password reset</b>
              </div>
              <div className="mb-1 text-center">
                <b>instructions has been</b>
              </div>
              <div className="mb-1 text-center">
                <b>sent to your email</b>
              </div>
              <div className="mb-4 text-center">
                <b>address</b>
              </div>
              <div className="text-center mb-2">
                <button
                  className="btn btn-sm btn-dark w-40 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  onClick={() => setShowDiv({ ...showDiv, password: false, reset: true, login: false, forgot: false })}
                >
                  CHANGE PASSWORD
                </button>
              </div>
              <div className="mt-6">
                <p className="text-start text-sm">
                  Don't have an account?
                  <button
                    className="ml-2 btn btn-sm btn-dark w-20 bg-black text-white py-1 rounded hover:bg-gray-800 transition"
                    onClick={register}
                  >
                    SIGN UP
                  </button>
                </p>
              </div>
            </div>
          )}
          {/* Reset Password Card */}
          {showDiv.reset && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-4">
                <p className="text-2xl font-normal">
                  <span className="text-2xl font-bold">Welcome to </span>
                  <img src={rosLogo7} alt="Logo" className="inline-block align-middle w-20 h-12 ml-[-14px] mt-[-5px]" />
                </p>
              </div>
              <div className="text-center mb-6">
                <img src={rosLogo5} alt="Logo" className="w-full ml-[-14px] mt-[-18px]" />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-center mb-2">
                <button
                  className="btn btn-sm btn-dark w-40 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  onClick={() => setShowDiv({ ...showDiv, reset: false, confirm: true, login: false, forgot: false, password: false })}
                >
                  CHANGE PASSWORD
                </button>
              </div>
              <div className="mt-6">
                <p className="text-start text-sm">
                  Don't have an account?
                  <button
                    className="ml-2 btn btn-sm btn-dark w-20 bg-black text-white py-1 rounded hover:bg-gray-800 transition"
                    onClick={register}
                  >
                    SIGN UP
                  </button>
                </p>
              </div>
            </div>
          )}
          {/* Password Change Confirmation Card */}
          {showDiv.confirm && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-4">
                <p className="text-2xl font-normal">
                  <span className="text-2xl font-bold">Welcome to </span>
                  <img src={rosLogo7} alt="Logo" className="inline-block align-middle w-20 h-12 ml-[-14px] mt-[-5px]" />
                </p>
              </div>
              <div className="text-center mb-6">
                <img src={rosLogo5} alt="Logo" className="w-full ml-[-14px] mt-[-18px]" />
              </div>
              <div className="mb-2 text-center">
                <b>Your password has been</b>
              </div>
              <div className="mb-2 text-center">
                <b>updated</b>
              </div>
              <div className="mb-4 text-center">
                <b>successfully</b>
              </div>
              <div className="text-center mb-2">
                <button
                  className="btn btn-sm btn-dark w-36 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  onClick={dashboard}
                >
                  LOGIN
                </button>
              </div>
              <div className="text-center mt-2">
                <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => setShowDiv({ ...showDiv, confirm: false, forgot: true })}
                >
                  <i className="fas fa-question-circle mr-1"></i>Forgot password?
                </button>
              </div>
              <div className="mt-6">
                <p className="text-start text-sm">
                  Don't have an account?
                  <button
                    className="ml-2 btn btn-sm btn-dark w-20 bg-black text-white py-1 rounded hover:bg-gray-800 transition"
                    onClick={register}
                  >
                    SIGN UP
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignIn;