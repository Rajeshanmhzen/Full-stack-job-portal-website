import { FaSearch } from "react-icons/fa";
// import CategoryCarosuel from "./CategoryCarosuel";

const heroSection = () => {
  return (
    <div className="text-center">
        <div className="flex flex-col gap-10 my-10">
            <h1 className="text-5xl font-bold">Search, Apply  <br />Get Your <span className="text-[#6A38C2]">Dream Job</span> </h1>
            <div className="flex w-[40%] h-12 shadow-lg border border-gray-200  rounded-full items-center mx-auto">
                <input type="text" placeholder="Find you dream job" className="outline-none border-none w-full h-full px-3 rounded-l-full"/>
                <button className="rounded-r-full bg-[#6A38C2] px-3 w-[60px] h-full text-white">
                <FaSearch className="h-10 w-6"  />
                </button>
            </div>
            {/* <CategoryCarosuel/> */}
        </div>
    </div>
  )
}

export default heroSection