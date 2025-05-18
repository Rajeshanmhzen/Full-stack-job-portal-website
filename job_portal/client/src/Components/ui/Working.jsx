import { FaFileAlt } from "react-icons/fa";
import Home_hero from '../../assets/main_hero_2.png'
const Working = () => {
  return (
    <div className='my-10'>
        <div className="text-4xl text-center font-semibold mb-3">
        How it <span className="text-purple-heart-500">Works</span> 
      </div>
      <div className="text-mine-shaft-300 w-1/2 mx-auto">
        Explore diverse job opportunities tailored to your skills. Start your
        career journey today!
      </div>
      <div className='flex items-center justify-between mt-10'>
        <div>
            <img
            className='w-[30rem]'
             src={Home_hero} 
             alt="how it works" />
        </div>
        <div className="mx-auto">
          <div className="flex gap-3 items-center mb-5">
            <div  className="p-2.5 bg-purple-heart-600 rounded-full">
<FaFileAlt  className="w-12 h-12"/>
            </div>
            <div>
              <h4 className="font-bold text-xl">Build Your Resume</h4>
              <p className="text-mine-shaft-200">
                Create a standout resume with your skills.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center mb-5">
                 <div  className="p-2.5 bg-purple-heart-600 rounded-full">
            <FaFileAlt  className="w-12 h-12"/>
            </div>
            <div>
              <h4 className="font-bold text-xl">Appy for Job</h4>
              <p className="text-mine-shaft-200">
                Find and apply for jobs thata match your skills
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center mb-5">
            
     <div  className="p-2.5 bg-purple-heart-600 rounded-full">
            <FaFileAlt  className="w-12 h-12"/>
            </div>
            <div>
              <h4 className="font-bold text-xl">Get Hired</h4>
              <p className="text-mine-shaft-200">
                Connect with employers and start your new job
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Working