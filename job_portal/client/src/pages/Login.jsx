import { notifications } from "@mantine/notifications"
import axios from "axios"
import {  Loader2 } from "lucide-react"
import { useState } from "react"
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setLoading } from "../store/userSlice"
import { USER_API_END_POINT } from "../utils/constant"


const Login = () => {
  const {loading} = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword,setShowPassword] = useState(false)
  const [data , setData] = useState({
    email:"",
    password:"",
    role:""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleInput = (e) => {
    const { name, value } = e.target;

    // Reset error for the specific field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "" // Resetting the error for the changed field
    }));

    // Update input data state
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!data.password || data.password.length < 7) {
      newErrors.password = "Password must contain at least 7 characters.";
    }
    if (!data.role) {
      newErrors.role = "Please select a role.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
   try {
    dispatch(setLoading(true))
    const res = await axios.post(`${USER_API_END_POINT}/user/login`, data,{
      headers:{
       "Content-Type" : "application/json"
      },
       withCredentials:true,
    })
    // console.log(res.data.success)
    if(res.data.success) {
      notifications.show({
                title:"Registered Successfully",
                message:"Redirecting to the login page...",
                icon:<FaCheckCircle  />,
                color:"teal",
                withBorder:true,
                className:"!border-green-500"
              })
      setTimeout(() => {
        navigate('/')
      }, 2000);
    }else {
      notifications.show({
        title: "Login Failed",
        message: res.data.message || "Invalid credentials or something went wrong.",
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    }
    
   } catch (error) {
    console.log(error)
   } finally {
    dispatch(setLoading(false))
   }
  }
    return (
      <>
      <form onSubmit={submitHandler} className="shadow-sm  flex flex-col justify-center items-center max-w-7xl mx-auto">
        <div className="container w-1/2 shadow-md shadow-purple-heart-800 rounded-md p-4 my-10">
          <h2 className="text-2xl font-semibold capitalize">Welcome back</h2>
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
         
         <div className="form-container my-5 mx-8">
          
          <div className="form-lists my-2">
           <label htmlFor="email">Email</label>
           <input type="email" id="email" name="email" value={data.email} onChange={handleInput} placeholder="Enter your email" />
           {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="form-lists relative">
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
          <div className="text-right mt-2 underline underline-offset-8">
            <Link to={"/forgot-password"} className=" ">Forget password</Link>
          </div>
          {
            loading 
            ? 
            <button className="flex align-middle justify-center py-2 px-2 w-full my-4 bg-orange-600 text-white "><Loader2 className="animate-spin"/> Please Wait</button>
            :
          <button type="submit" className="w-full my-4 bg-purple-heart-700 text-white text-lg py-2 px-2 rounded-sm hover:bg-[#743dd2]">Submit</button>
          }
          <span className="text-sm"> Have an account? <Link to={"/register"} className="underline text-purple-heart-700 hover:text-purple-heart-600">Register</Link></span>
         </div>
  
        </div>
      </form>
  
      </>
    )
}

export default Login