import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store'
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

createRoot(document.getElementById('root')).render(
    <Provider store={store} >
        <MantineProvider defaultColorScheme="dark">
            <Notifications position="top-right" />
            <RouterProvider router={router} />
        </MantineProvider>
    </Provider>
)
