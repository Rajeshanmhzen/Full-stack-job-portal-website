import { setLoading } from "@/store/userSlice"
import { USER_API_END_POINT } from "@/utils/constant"
import { notifications } from "@mantine/notifications"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { FaEye, FaEyeSlash,FaCheckCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

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
    role:""
  })

  const handleInput = (e) => {
  setData({...data, [e.target.name]:e.target.value})
  }
    const submitHandler = async(e) => {
      e.preventDefault();

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
      <div className="container w-1/2 shadow-md rounded-md p-4 my-10">
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
        </div>
       
       <div className="form-container my-5 mx-8">
        <div className="form-lists my-2">
          <label htmlFor="name"> Full Name</label>
          <input type="text" id="name" name="fullname" onChange={handleInput} autoComplete="false" placeholder="Enter your full name..."  />
        </div>
        <div className="form-lists my-2">
          <label htmlFor="email"> Email</label>
          <input type="email" id="email" name="email" onChange={handleInput} autoComplete="false" placeholder="Enter your email..."  />
        </div>
        <div className="form-lists my-2">
          <label htmlFor="phone"> Phone Number</label>
          <input type="tel" id="phone" name="phoneNumber" onChange={handleInput} autoComplete="false" placeholder="Enter your phone number..." />
        </div>
        <div className="form-lists relative">
            <label htmlFor="password">Password</label>
            <input type={showPassword ? "text": "password" } id='password' className='password h-10 py-1 px-3' name='password'onChange={handleInput}  placeholder='Enter password'/>
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
        {
            loading 
            ? 
            <button className="flex align-middle justify-center py-2 px-2 w-full my-4 bg-orange-600 text-white "><Loader2 className="animate-spin"/> Please Wait</button>
            :
          <button type="submit" className="w-full my-4 bg-orange-600 text-white text-lg py-2 px-2 rounded-sm">Submit</button>
          }
        <span className="text-sm">Don't have an account? <Link to={"/login"} className="underline text-orange-600 hover:text-orange-400">Login</Link></span>
       </div>

      </div>
    </form>

    </>
  )
}

export default Register