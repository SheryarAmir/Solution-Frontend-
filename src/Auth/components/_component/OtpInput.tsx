import React from "react";

interface OtpInputProps {
  onVerify: () => void;
  onLogin: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ onVerify, onLogin }) => {
  return (
    <div className="flex flex-col h-full">
      {/* You can import and use LogoHeader here if needed */}
      <div className="flex-grow flex flex-col justify-center items-center">
        <p className="text-lg font-bold mb-4">Enter OTP</p>
        <div className="flex space-x-4">
          {[0, 1, 2, 3].map((_, idx) => (
            <input
              key={idx}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:ring-primary_blue focus:border-primary_blue outline-none"
              type="text"
              maxLength={1}
            />
          ))}
        </div>
      </div>
      <div className="text-center mt-4">
        <button
          className="w-[120px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
          onClick={onVerify}
        >
          VERIFY
        </button>
      </div>
      <div className="mt-auto text-center pt-4">
        <p className="text-sm opacity-50 inline-block">Have an account?</p>
        <button
          className="ml-2 w-[100px] h-10 bg-primary_blue text-white font-medium text-base rounded-md hover:bg-primary_blue/90"
          onClick={onLogin}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default OtpInput; 