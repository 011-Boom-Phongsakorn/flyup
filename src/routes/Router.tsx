import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';


// Public Pages
import Home from '../pages/public/Home';
import MainLayout from '../layouts/MainLayout';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';

import { Loader2 } from 'lucide-react';

const Router = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/' />} />
                        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
                    </Route>
                </Routes>
                <Toaster position='top-right' />
            </BrowserRouter>
        </>
    )
}

export default Router