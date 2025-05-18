
import Header from './Components/shared/Header'

import { Outlet } from 'react-router-dom';
function App() {

  return (
    <>
    <div className='mx-20'>
      <Header/>
      <Outlet/>
    </div>
    </>
  )
}

export default App
