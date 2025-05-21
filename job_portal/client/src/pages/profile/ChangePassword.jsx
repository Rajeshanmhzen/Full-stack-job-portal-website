import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constant";
import { Button } from "@mantine/core";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.currentPassword || data.currentPassword.length < 7) {
      newErrors.currentPassword =
        "Current password must be at least 7 characters.";
    }

    if (!data.newPassword || data.newPassword.length < 7) {
      newErrors.newPassword = "New password must be at least 7 characters.";
    }

    if (data.newPassword !== data.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
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
        `${USER_API_END_POINT}/user/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        notifications.show({
          title: "Password Changed",
          message:
            "Your password has been updated successfully. Redirecting to home page",
          icon: <FaCheckCircle />,
          color: "teal",
          withBorder: true,
          className: "!border-green-500",
        });

        // Optionally redirect
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        notifications.show({
          title: "Error",
          message: res.data.message || "Something went wrong.",
          color: "red",
          withBorder: true,
          className: "!border-red-500",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Server Error",
        message: error.response?.data?.message || "Failed to update password.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="shadow-sm flex  justify-center items-center my-15"
    >
      <div className="w-full max-w-2xl mx-auto shadow-md shadow-purple-heart-800 rounded-md p-6">
        <Button
          leftSection={<IoMdArrowRoundBack size={14} />}
          variant="default"
          mb="20"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <h2 className="text-2xl font-semibold">Reset your password</h2>
        <p className="text-mine-shaft-400 mb-6">
          Must be different to previous passwords.{" "}
        </p>
        <div className="my-4">
          <div className="form-lists relative">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={data.currentPassword}
              onChange={handleInput}
              className="w-full h-10 py-1 px-3 border rounded-md"
              placeholder="Enter current password"
            />
            <div
              className="passwordseen absolute bottom-3 right-4 cursor-pointer"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errors.currentPassword && (
            <span className="text-red-500 text-sm">
              {errors.currentPassword}
            </span>
          )}
        </div>

        <div className="my-4">
          <div className="form-lists  relative">
            <label htmlFor="newPassword">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={data.newPassword}
              onChange={handleInput}
              className="w-full h-10 py-1 px-3 border rounded-md"
              placeholder="Enter new password"
            />
            <div
              className="passwordseen absolute bottom-3 right-4 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-sm">{errors.newPassword}</span>
          )}
        </div>

        <div className="my-4">
          <div className="form-lists relative">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={data.confirmNewPassword}
              onChange={handleInput}
              className="w-full h-10 py-1 px-3 border rounded-md"
              placeholder="Confirm new password"
            />
            <div
              className="passwordseen absolute bottom-3 right-4 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.confirmNewPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmNewPassword}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <button
            type="button"
            disabled
            className="flex items-center justify-center py-2 px-4 w-full bg-purple-heart-700 text-white rounded"
          >
            <Loader2 className="animate-spin mr-2" />
            Please Wait...
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-purple-heart-700 text-white text-lg py-2 px-4 rounded hover:bg-[#743dd2]"
          >
            Update Password
          </button>
        )}
      </div>
    </form>
  );
};

export default ChangePassword;
