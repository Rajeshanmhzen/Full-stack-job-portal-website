import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios"
export default function CodeVerification() {
   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const { token } = useParams();

    const handleChange = (index, value) => {
      if (/^\d?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
          document.getElementById(`otp-${index + 1}`).focus();
        }
      }
    };
     const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullOtp = otp.join("");
    
    if (fullOtp.length !== 6) {
      setMessage("Please enter the full 6-digit OTP.");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/user/verify-reset/${token}`,
        { otp: fullOtp }
      );
      
      setMessage(response.data.message || "OTP verified successfully!");
      
      setTimeout(() => {
        navigate(`/reset-password/${token}`);
      }, 1000);
      
    } catch (error) {
      console.error("OTP verification failed:", error);
      setMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Verification failed. Please check your code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCode = async () => {
  try {
    setResendLoading(true);
    const email = localStorage.getItem("reset_email");

    const response = await axios.post(
      `http://localhost:8081/api/v1/user/resendverification`,
      { email }
    );

    if (response.data.token) {
      const newToken = response.data.token;
      localStorage.setItem("reset_token", newToken);

      // ✅ Corrected: update router state
      navigate(`/verify-reset/${newToken}`, { replace: true });
    }

    setResendLoading(false);
  } catch (error) {
    console.error("OTP verification failed:", error);
    alert(error.response?.data?.message || "Verification failed.");
  }
};

   return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-trasparent px-4">
      <div className="bg-traparent shadow-lg rounded-xl p-8 max-w-md w-full text-center shadow-purple-heart-700">
        {message && (
          <div className={`p-3 mb-4 rounded-md ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        
        <h2 className="text-2xl font-semibold mb-4 text-purple-heart-700">Email Verification</h2>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code sent to your email
        </p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex justify-center gap-1 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-xl text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Didn't get the code?{' '}
            <button 
              type="button"
              className="text-purple-heart-700 hover:underline" 
              onClick={handleResetCode}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
          
          <div className="flex justify-between">
            <Link 
              to="/forgot-password" 
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 hover:text-purple-heart-700 text-purple-heart-100 "
            >
              Back
            </Link>
            <button 
              type="submit" 
              className={`px-6 py-2 rounded-md ${isLoading ? 'bg-purple-heart-700' : 'bg-purple-heart-800 hover:bg-purple-heart-700'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}