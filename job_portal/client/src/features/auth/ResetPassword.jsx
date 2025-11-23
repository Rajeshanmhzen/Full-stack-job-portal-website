import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { USER_API_END_POINT } from "../../utils/constant";

export default function ResetPassword() {
     const {token} = useParams()
      const navigate = useNavigate();
      const [data, setData] = useState({
        password:'',
        confirmPassword:'',
      })
       const [showPassword,setShowPassword] = useState(false)
       const [showConfirmPassword,setShowConfirmPassword] = useState(false)
      const [errors, setErrors] = useState({
    password: "",
    confirmPassword : ""
  });
     const handleInput = (e) => {
  setData({...data, [e.target.name]:e.target.value})
   if (!validateForm()) {
      return;
    }
  }
   const validateForm = () => {
    const newErrors = {};
    
    if (!data.password ) {
      newErrors.password = "Please enter the password";
    }
    if (data.password.length < 7) {
      newErrors.password = "Password must contain at least 7 characters.";
    }
   if(!data.confirmPassword) {
    newErrors.confirmPassword = "Please enter the confirm password"
   }
   if (data.confirmPassword.length < 7) {
      newErrors.password = "Password must contain at least 7 characters.";
    }
   if(data.confirmPassword !== data.confirmPassword ) {
    newErrors.confirmPassword = "password incorrect. Please check"
   }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    
      const handleSubmit = async (e) => {
    e.preventDefault();

   if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/resetpassword/${token}`,
        { password:data.password }
      );
console.log("from the resetpassword",response.data)
      if (response.status === 200) {
        localStorage.removeItem("reset_email");
        localStorage.removeItem("reset_token");
        alert("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset failed:", error);
      alert(error.response?.data?.error || "Password reset failed.");
    }
  };


  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md bg-transparent rounded-xl shadow-lg shadow-purple-heart-600 p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-heart-300 text-purple-heart-800 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5c-4 0-8 2-8 6s4 6 8 6 8-2 8-6-4-6-8-6z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-purple-heart-200  mb-2">Set new password</h2>
        <p className="text-center text-sm text-mine-shaft-400 mb-6">Must be at least 7 characters.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
           <div className="form-lists relative ">
                        <label htmlFor="password">Password</label>
                        <input type={showPassword ? "text": "password" } id='password' className=' h-10 py-1 px-3' name='password' value={data.password} onChange={handleInput}  placeholder='Enter password'/>
                        <div className='passwordseen absolute bottom-2 right-4' onClick={()=>setShowPassword((prev)=>!prev)}>
                            <span> 
                                {
                                     showPassword ? (
                                        <FaEyeSlash/>
                                    )
                                    :
                                    (
                                        <FaEye/>
                                    )
                              }
                                
                            </span>
                        </div>
                    </div>
                            {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password}</span>
                      )}
                    </div>
                    <div className="mb-5">

                   
           <div className="form-lists relative mb-5">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type={showConfirmPassword ? "text": "password" } id='confirmpassword' className=' h-10 py-1 px-3' name='confirmPassword' value={data.confirmPassword} onChange={handleInput}  placeholder='Enter password'/>
                        <div className='passwordseen absolute bottom-2 right-4' onClick={()=>setShowConfirmPassword((prev)=>!prev)}>
                            <span> 
                                {
                                     showConfirmPassword ? (
                                        <FaEyeSlash/>
                                    )
                                    :
                                    (
                                        <FaEye/>
                                    )
                              }
                                
                            </span>
                        </div>
                    </div>
                            {errors.confirmPassword && (
                        <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                      )}
                     </div>
          <button
            type="submit"
            className="w-full bg-purple-heart-700 text-white py-2 rounded-md hover:bg-purple-heart-800 transition"
          >
            Reset password
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-mine-shaft-200 hover:underline">← Back to log in</Link>
        </div>
      </div>
    </div>
  );
}