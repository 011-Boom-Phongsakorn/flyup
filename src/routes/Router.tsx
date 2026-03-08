import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from '../pages/public/Home';
import MainLayout from '../layouts/MainLayout';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';

const Router = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                </Route>
            </Routes>
            <Toaster position='top-right' />
        </BrowserRouter>
    </>
  )
}

export default Router