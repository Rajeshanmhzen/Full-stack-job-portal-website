import Footer from './components/shared/Footer.jsx';
import Header from './components/shared/Header.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import useGetAllNotifications from './hooks/useGetAllNotifications';
import { ThemeProvider } from './contexts/ThemeContext';

import { Outlet } from 'react-router-dom';
function App() {
  // Initialize notifications globally
  useGetAllNotifications();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className='min-h-screen theme-bg'>
          <Header/>
          <div className='my-10'>
            <Outlet/>
          </div>
          <Footer/>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
