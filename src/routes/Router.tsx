import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from '../pages/public/Home';
import MainLayout from '../layouts/MainLayout';

const Router = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                </Route>
            </Routes>
            <Toaster position='top-right' />
        </BrowserRouter>
    </>
  )
}

export default Router