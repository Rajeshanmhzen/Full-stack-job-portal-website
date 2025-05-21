import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!data.password || data.password.length < 7) {
      newErrors.password = "Password must be at least 7 characters.";
    }
    if (!data.role) {
      newErrors.role = "Please select a role.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/user/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));

        // Optional: store role in localStorage if you need it on refresh
        localStorage.setItem("userRole", res.data.user.role);

        notifications.show({
          title: "Login Successfully",
          message: "Redirecting to the Home page...",
          icon: <FaCheckCircle />,
          color: "teal",
          withBorder: true,
          className: "!border-green-500",
        });

        setTimeout(() => navigate("/"), 1500);
      } else {
        notifications.show({
          title: "Login Failed",
          message: res.data.message || "Invalid credentials.",
          color: "red",
          withBorder: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notifications.show({
        title: "Error",
        message: "Something went wrong. Try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="shadow-sm flex flex-col justify-center items-center max-w-7xl mx-auto"
    >
      <div className="container w-1/2 shadow-md rounded-md p-4 my-10">
        <h2 className="text-2xl font-semibold">Welcome Back</h2>
        <div className="radio-title-group">
          <div className="input-container">
            <input type="radio"
             id="recruiter"
              name="role"
              value="recruiter" 
              checked={data.role ==='recruiter'}
              onChange={handleInput} />
            <div className="radio-title">
            <label htmlFor="recruiter">Recruiter</label>
            </div>
          </div>
          <div className="input-container">
            <input type="radio"
             id="worker"
             name="role"
             value="worker"
             checked={data.role ==='worker'}
             onChange={handleInput}  />
            <div className="radio-title">
            <label htmlFor="worker">Worker</label>
            </div>
          </div>
          {errors.role && (
  <span className="text-red-500 text-sm">{errors.role}</span>
)}
        </div>
        <div className="form-lists my-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleInput}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>
        <div className="form-lists relative my-2">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleInput}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded"
          />
          <div
            className="absolute bottom-3 right-4 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>
        <div className="text-right my-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div>
          {loading ? (
            <button
              type="button"
              className="w-full bg-purple-heart-700 text-white py-2 rounded flex justify-center items-center"
            >
              <Loader2 className="animate-spin mr-2" /> Please Wait...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-heart-700 text-white py-2 rounded hover:bg-purple-800"
            >
              Submit
            </button>
          )}
        </div>
        <p className="text-sm mt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-700 underline hover:text-purple-600"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
