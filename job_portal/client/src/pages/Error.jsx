import { NavLink } from 'react-router-dom'
import Button from '../Components/shared/button';

const Error = () => {
  return (
    <>
        <div className='err-page'>
            <div className="my-4 ">
                <h2 className="text-7xl my-3">404</h2>
                <h4 className='text-[18px]  my-3 font-semibold'>Sorry, page not found</h4>
                <div className="err-p">
                <p>
                    Oops! It seems lie the page you're trying to access doesn't exits.
                    If you believe there's and issue, fell free to report it, and we'll look into it.
                </p>
                </div>
                <div className="flex items-center justify-center gap-8 my-9">
                    <NavLink to="/" className='btn-links'>
                       <Button value="Return Home" />
                    </NavLink>
                    <NavLink to="/contact" className='text-xl text-white rounded-full bg-[#ff4d05] px-3 py-3'>
                        Report Problem
                    </NavLink>
                </div>
            </div>
        </div>
    </>
  )
}

export default Error;