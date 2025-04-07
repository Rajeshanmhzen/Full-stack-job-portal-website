import { Link } from "react-router-dom"


const Button = ({value, icons, showIcons, link}) => {
  return (
    <div>
        <Link className="btn" to={link} >
            {
              showIcons ? (
                <>
                  <span>{value}</span>
                  <span className='iconbtn'>{icons}</span>
                </>
              ) : (
                <span>{value}</span>
              )
            }
        </Link>
    </div>
  )
}

export default Button