import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

const getUserRoleFromToken = () => {
  const token = getCookie("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export default getUserRoleFromToken;
