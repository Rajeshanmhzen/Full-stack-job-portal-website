import { notifications } from "@mantine/notifications"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { FaEye, FaEyeSlash,FaCheckCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setLoading } from "../store/userSlice"
import { USER_API_END_POINT } from "../utils/constant"

const Register = () => {
  const {loading} = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword,setShowPassword] = useState(false)
  const [data , setData] = useState({
    fullname:"",
    email:"",
    password:"",
    phoneNumber:"",
    role:"",
  })
 const [errors, setErrors] = useState({
  fullname:"",
    email: "",
    password: "",
    role: "",
    phoneNumber:"",
  });
  const handleInput = (e) => {
  setData({...data, [e.target.name]:e.target.value})
  
  }

  const validateForm = () => {
    const newErrors = {};
    if(!data.fullname) {
      newErrors.fullname = "Please provide the fullname"
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!data.password || data.password.length < 7) {
      newErrors.password = "Password must contain at least 7 characters.";
    }
    if (!data.role) {
      newErrors.role = "Please select a role.";
    }
     if(!data.phoneNumber) {
      newErrors.phoneNumber = "Please provide the phoneNumber"
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
      const res = await axios.post(`${USER_API_END_POINT}/user/register`, data,{
        headers:{
         "Content-Type" : "application/json"
        },
         withCredentials:true,
      })
      if(res.data.success) {

        // toast.success(res.data.message)
        notifications.show({
          title:"Registered Successfully",
          message:"Redirecting to the login page...",
          icon:<FaCheckCircle />,
          color:"teal",
          withBorder:true,
          className:"!border-green-500"
        })
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
      if(res.data.error) {
        // toast.error(res.data.message)
      }
     } catch (error) {
      console.log(error)
      // toast.error(data.message)
     }
     finally {
         dispatch(setLoading(false))
        }
    }
      return (
    <>
    <form onSubmit={submitHandler} className="shadow-sm  flex flex-col justify-center items-center max-w-7xl mx-auto">
      <div className="container w-1/2 shadow-md rounded-md p-4 my-10 shadow-purple-heart-800">
        <h2 className="text-2xl">Register for free</h2>
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
          <label htmlFor="name"> Full Name</label>
          <input type="text" id="name" name="fullname" onChange={handleInput} autoComplete="false" placeholder="Enter your full name..."  />
          {errors.fullname && (
              <span className="text-red-500 text-sm">{errors.fullname}</span>
            )}
        </div>
        <div className="form-lists my-2">
          <label htmlFor="email"> Email</label>
          <input type="email" id="email" name="email" onChange={handleInput} autoComplete="false" placeholder="Enter your email..."  />
          {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
        </div>
        <div className="form-lists my-2">
          <label htmlFor="phoneNumber"> Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" onChange={handleInput} autoComplete="false" placeholder="Enter your phone number..." />
          {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
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
        {
            loading 
            ? 
            <button className="flex align-middle justify-center py-2 px-2 w-full my-4 bg-orange-600 text-white "><Loader2 className="animate-spin"/> Please Wait ...</button>
            :
          <button type="submit" className="w-full my-4 bg-[#6A38C2] text-white text-lg py-2 px-2 rounded-sm hover: bg-[#743dd2]">Submit</button>
          }
        <span className="text-sm">Don't have an account? <Link to={"/login"} className="underline text-[#6A38C2] hover:text-[#743dd2]">Login</Link></span>
       </div>

      </div>
    </form>

    </>
  )
}

export default Register