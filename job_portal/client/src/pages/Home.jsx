import { FaSearch } from "react-icons/fa";
import Home_hero from '../assets/main_hero_1.png';
import { Avatar } from '@mantine/core';
import avatar_3 from "../assets/avatar_3.png";
import avatar_2 from "../assets/avatar_2.png";
import avatar_1 from "../assets/avatar_1.png";
import netflix from '../assets/netflix.png';
import Companies from "../components/ui/Companies";
import Dreamjobs from "../components/ui/Dreamjobs";
import Working from "../components/ui/Working";

const Home = () => {
  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center my-10 w-full h-auto lg:h-[calc(100vh-100px)] px-4 md:px-10">
        <div className="w-full lg:w-[55%] mt-10 lg:mt-0">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find your<br />
              Get Your <span className="text-purple-heart-700">Dream Job</span><br />
              with us
            </h1>
            <p className="text-base md:text-lg text-mine-shaft-300">
              Good life with a good company. Start explore thousands of jobs in one place.
            </p>

            <div className="flex w-full md:w-[80%] h-12 shadow-lg border border-gray-200 rounded-full items-center">
              <input
                type="text"
                placeholder="Find your dream job"
                className="outline-none border-none w-full h-full px-4 rounded-l-full text-sm"
              />
              <button className="rounded-r-full bg-[#6A38C2] px-3 w-[60px] h-full text-white flex items-center justify-center">
                <FaSearch className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex justify-center items-center">
          <div className="h-auto w-full max-w-[30rem] relative mx-auto">
            <img src={Home_hero} alt="Hero" className="w-full h-auto object-contain" />

            <div className="absolute w-fit bottom-1 left-1 border border-purple-heart-700 rounded-lg p-2 backdrop-blur-md bg-white/30">
              <div className="text-sm font-medium text-white">10K+ got job</div>
              <Avatar.Group spacing="sm" mt={5}>
                <Avatar src={avatar_1} />
                <Avatar src={avatar_2} />
                <Avatar src={avatar_3} />
                <Avatar>+5</Avatar>
              </Avatar.Group>
            </div>

            <div className="absolute w-fit top-10 right-[-20px] sm:right-[-30px] lg:right-[-50px] border border-purple-heart-700 rounded-lg p-3 backdrop-blur-md bg-white/30">
              <div className="flex gap-2 items-center">
                <Avatar src={netflix} alt="netflix company logo" radius="sm" />
                <div>
                  <h3 className="font-bold text-sm leading-4 text-white">Software Developer</h3>
                  <p className="text-xs text-mine-shaft-200">New York</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-white mt-2">
                <span>1 day ago</span>
                <span>120 applicants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Companies />
      <Dreamjobs />
      <Working />
    </div>
  );
};

export default Home;
