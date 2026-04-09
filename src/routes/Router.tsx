import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Public Pages
import Home from '../pages/public/Home';
import Projects from '../pages/public/Projects';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';
import VerifyEmail from '../pages/public/VerifyEmail';
import ProjectDetail from '../pages/public/ProjectDetail';
import Investment from '../pages/public/Investment';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';

import { Loader2 } from 'lucide-react';

// Pioneer Pages
import ProjectOverview from '../pages/pioneer/ProjectOverview';
import Dashboard from '../pages/pioneer/Dashboard';
import PioneerLayout from '../layouts/PioneerLayout';
import MyProjects from '../pages/pioneer/MyProjects';
import Profile from '../pages/pioneer/Profile';
import ProjectStageLayout from '../layouts/ProjectStageLayout';
import Step1Basics from '../components/steps/Step1Basics';
import Step2Story from '../components/steps/Step2Story';
import Step3Milestone from '../components/steps/Step3Milestone';
import Step4Agreement from '../components/steps/Step4Agreement';
import Preview from '../pages/pioneer/Preview'
import MilestonePage from '../pages/pioneer/MilestonePage'
import MilestoneListPage from '../pages/pioneer/MilestoneListPage';

const PioneerGuard = () => {
    const { authUser } = useAuthStore()
    if (!authUser) return <Navigate to='/login' replace />
    if (authUser.role !== 'pioneer') return <Navigate to='/' replace />
    return <Outlet />
}

const Router = () => {
    const { authUser, checkAuth, isCheckingAuth, loginWithGoogleToken } = useAuthStore()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const isVerifyPage = window.location.pathname === '/verify'
        if (token && !isVerifyPage) {
            loginWithGoogleToken(token)
            params.delete('token')
            const newSearch = params.toString()
            window.history.replaceState({}, '', newSearch ? `?${newSearch}` : window.location.pathname)
        }
        checkAuth()
    }, [checkAuth, loginWithGoogleToken])

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
                        <Route path='/forgot/password' element={!authUser ? <ForgotPassword /> : <Navigate to='/' />} />
                        <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to='/' />} />
                        <Route path='/projects' element={<Projects />} />
                        <Route path='/verify' element={<VerifyEmail />} />
                        <Route path='/projects/:id' element={<ProjectDetail />} />
                        <Route path='/projects/:id/invest' element={<Investment />} />
                    </Route>

                    <Route element={<PioneerGuard />}>
                        <Route element={<PioneerLayout />}>
                            <Route path='/pioneer/dashboard' element={<Dashboard />} />
                            <Route path='/pioneer/dashboard/projects' element={<MyProjects />} />
                            <Route path='/pioneer/dashboard/milestones' element={<MilestoneListPage />} />
                            <Route path='/pioneer/dashboard/projects/:projectId/milestones' element={<MilestonePage />} />
                            <Route path='/pioneer/profile' element={<Profile />} />
                        </Route>
                        <Route element={<MainLayout />}>
                            <Route path='/preview/:projectId' element={<Preview />} />
                            <Route path='/project/overview/:projectId' element={<ProjectOverview />} />
                            <Route path='/project/overview/:projectId/step' element={<ProjectStageLayout />}>
                                <Route index element={<Navigate to="1" replace />} />
                                <Route path='1' element={<Step1Basics />} />
                                <Route path='2' element={<Step2Story />} />
                                <Route path='3' element={<Step3Milestone />} />
                                <Route path='4' element={<Step4Agreement />} />
                            </Route>
                            <Route path='/preview/:projectId' element={<Preview />} />
                        </Route>
                    </Route>
                </Routes>
                <Toaster position='top-right' />
            </BrowserRouter>
        </>
    )
}

export default Router
