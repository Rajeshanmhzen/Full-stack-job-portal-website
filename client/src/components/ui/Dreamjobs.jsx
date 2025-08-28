import { Carousel } from "@mantine/carousel";

const Dreamjobs = () => {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className=" mt-20 pb-5 px-10 text-center">
      <div className="text-3xl md:text-4xl text-center font-semibold mb-3">
        Browse <span className="text-purple-heart-500">Job</span> Category
      </div>
      <div className=" sm:w-full text-mine-shaft-300 md:w-1/2 mx-auto">
        Explore diverse job opportunities tailored to your skills. Start your
        career journey today!
      </div>
      <Carousel
        slideGap={"md"}
        slideSize={"22%"}
        loop
        className="focus-visible:{&_button]:!outline-none [&_button]:!bg-purple-heart-700 [&_button]:text-mine-shaft-300  [&_button]:hover:!opacity-75 {&_button]:opacity-0 mt-10"
      >
        {arr.map((_, index) => {
          return (
            <Carousel.Slide key={index}>
              <div
                key={index}
                className=" flex flex-col items-center gap-2  w-64 border border-purple-heart-700 rounded-xl px-1 py-3 "
              >
                <div className="p-2 rounded-full">
                  <img
                    src="../../assets/avatar_1.png"
                    alt=""
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-purple-heart-700 font-semibold text-xl">
                  Digital Marketing
                </div>
                <p className="text-sm text-center text-mine-shaft-300">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Eveniet fugit aperiam alias! Necessitatibus nihil id, magnam
                  temporibus ut reiciendis corrupti eos eligendi laudantium
                  dolorem?
                </p>
                <div className="text-purple-heart-500">1K+ job posted</div>
              </div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Dreamjobs;
