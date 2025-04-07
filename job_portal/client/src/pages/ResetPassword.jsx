import  { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/user/verify-reset-token?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          setMessage("Token verified. You can reset your password.");
          console.log(token)
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Error verifying token.", error);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const resetPassword = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/v1/user/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Error resetting password.", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
