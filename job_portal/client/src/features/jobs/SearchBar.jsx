import MultiInput from './MultiInput'
import { dropdownData } from '../../constants/JobData'

const Searchbar = () => {
  return (
    <div className='px-4'>
    <div className='flex gap-2'>
    {
      dropdownData.map((item, index)=> {
return<>
      <div className='w-1/4 border-e-2 border-mine-shaft-800' key={index} >
        <MultiInput {...item}/>
      </div>
</>
      })
    }
    </div>
    </div>
  )
}

export default Searchbar