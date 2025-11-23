import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-sm px-6 py-4'>
        <h1 className='text-xl font-bold text-purple-600'>JobHunt</h1>
      </nav>
      <div className='my-10'>
        <Outlet/>
      </div>
      <footer className='bg-gray-800 text-white p-4 text-center'>
        <p>&copy; 2024 JobHunt. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
