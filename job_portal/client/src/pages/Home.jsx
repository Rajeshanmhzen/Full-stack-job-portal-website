import { FaSearch } from "react-icons/fa";
import Home_hero from '../assets/main_hero_1.png'
import  {Avatar}  from '@mantine/core';
import avatar_3 from "../assets/avatar_3.png"
import avatar_2 from "../assets/avatar_2.png"
import avatar_1 from "../assets/avatar_1.png"
import netflix from '../assets/netflix.png'
import Companies from "../Components/companies";
import Dreamjobs from "../Components/ui/Dreamjobs";
import Working from "../Components/ui/Working";
const Home = ()=> {
return(
    <>
    <div className="flex  justify-between items-center  my-20 w-full
    h-[calc(100vh - 100px)]">
      <div className=" w-[55%] ">
        <div className="flex flex-col gap-10 my-10   ">
            <h1 className="text-6xl font-bold">Find your<br />Get Your <span className="text-purple-heart-700">Dream Job</span><br/> with us</h1>
            <p className="text-lg text-mine-shaft-300">Good life with a good company. Start explore thousands of jobs in  one place</p>
            <div className="flex w-[80%] h-12 shadow-lg border border-gray-200  rounded-full items-center">
                <input type="text" placeholder="Find you dream job" className="outline-none border-none w-full h-full px-4 rounded-l-full"/>
                <button className="rounded-r-full bg-[#6A38C2] px-3 w-[60px] h-full text-white">
                <FaSearch className="h-10 w-6"  />
                </button>
            </div>
        </div>
    </div>
    <div className="w-[45%] flex justify-between items-center">
    <div className="h-80 w-[30rem] relative mx-auto">
        <img src={Home_hero} alt="About the image" />
        <div className="absolute w-fit bottom-1 left-1  border-purple-heart-700 border rounded-lg p-2 backdrop-blur-md ">
            <div className="text-center">10K+ got job</div>
            <Avatar.Group>
                <Avatar src={avatar_1} />
                <Avatar src={avatar_2} />
                <Avatar src={avatar_3} />
            <Avatar>+5</Avatar>
            </Avatar.Group>
        </div>
        <div className="absolute w-fit top-20 right-[-50px]  border-purple-heart-700 border rounded-lg p-2 backdrop-blur-md ">
           <div className="flex gap-1 items-center">
             <Avatar src={netflix} alt="netflix company logo" radius="sm"/>
            <div>
            <h3 className="font-bold leading-3">Software Developer</h3>
            <p className="tracking-tighter text-mine-shaft-400">New York</p>
            </div>
           </div>
           <div className="flex items-center justify-around">
            <span>
1 day ago
            </span>
            <span>
             120 applicants
            </span>
             </div>
        </div>
    </div>
     </div>
     </div>
     <Companies/>
     <Dreamjobs/>
     <Working/>
    </>
)
}
export default Home