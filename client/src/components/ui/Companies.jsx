import Marquee from "react-fast-marquee";
import amazon from "../../assets/amazon.jpg"
import google from "../../assets/google.jpg"
import netflixbg from "../../assets/netflix_bg.png"
const Companies = () => {
    const companies = [
        {
            id:1,
            image: amazon,
            name:"Amazon"
        },
        {
            id:2,
            image: google,
            name:"google"
        },
        {
            id:3,
            image: netflixbg,
            name:"netflix"
        },
    ]
  return (
    <div>
        <h2 className="text-4xl font-semibold text-center my-10 ">Trusted By <span className="text-purple-heart-900">1000+</span> Companies</h2>
        <Marquee pauseOnHover={true}>
            {
                companies.map((el)=> [
                    <div key={el.id} className="mx-8 px-2 py-1">
                        <img src={el.image} alt={el.name} className="h-14" />
                    </div>
                ])
            }
        </Marquee>
    </div>
  )
}

export default Companies