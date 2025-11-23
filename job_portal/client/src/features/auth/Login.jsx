import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RESUME_API_END_POINT, USER_API_END_POINT } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { setRecommendations, setResume } from "../../store/resumeSlice";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [loginError, setLoginError] = useState("");
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
        `${USER_API_END_POINT}/login`,
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
        
        localStorage.setItem("userRole", res.data.user.role);
      
      const resumeRes = await axios.get(`${RESUME_API_END_POINT}`, {
        withCredentials: true,
      });

      if (resumeRes.data.success && resumeRes.data.resume) {
        dispatch(setResume(resumeRes.data.resume));
      }

      const recommendRes = await axios.get(`${RESUME_API_END_POINT}`, {
        withCredentials: true,
      });

      if (recommendRes.data.success) {
        dispatch(setRecommendations(recommendRes.data.recommendations));
      }

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
     const msg = error?.response?.data?.message || "Something went wrong.";
setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="shadow-sm flex flex-col justify-center items-center max-w-7xl mx-auto"
    >
      <div className="container sm:w-full shadow-md rounded-md p-4 my-10 md:w-1/2 ">
        <h2 className="text-2xl font-semibold">Welcome Back</h2>
        {loginError && (
  <div className="text-red-600 text-sm mb-3 text-center">{loginError}</div>
)}
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
            className="text-sm text-purple-500  hover:underline"
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
            className="text-purple-500 underline hover:text-purple-600"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
