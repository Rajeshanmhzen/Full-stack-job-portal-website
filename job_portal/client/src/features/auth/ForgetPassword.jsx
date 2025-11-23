import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constant";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post(`${USER_API_END_POINT}/forget-password`, {
        email
      });
      setMessage(response.data.message || "Reset instructions sent to your email");
      localStorage.setItem("reset_email", email);
      if (response.data.token) {
        const token = response.data.token
        localStorage.setItem("reset_token", token);
        setTimeout(() => navigate(`/verify-reset/${token}`), 1500);
      }
        setIsLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error ||  error.response?.data?.message || "Error sending password reset request.";
      setMessage(errorMessage);
      console.error("Password reset error:", error);
    } 
  };

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-none px-4">
      <div className="w-full max-w-md bg-none rounded-xl shadow-lg shadow-purple-heart-900 p-8">
        {message && (
          <div className={`p-3 mb-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-heart-950 text-purple-heart-300 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5c-4 0-8 2-8 6s4 6 8 6 8-2 8-6-4-6-8-6z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-purple-heart-100 mb-2">Forgot password?</h2>
        <p className="text-center text-sm text-purple-heart-300 mb-6">No worries, we'll send you reset instructions.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm font-medium text-purple-heart-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-purple-heart-700' : 'bg-purple-heart-700 hover:bg-purple-heart-800'} text-white py-2 rounded-md transition`}
          >
            {isLoading ? 'Sending...' : 'Reset password'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-purple-heart-300 hover:underline">← Back to log in</Link>
        </div>
      </div>
    </div>
  );
}