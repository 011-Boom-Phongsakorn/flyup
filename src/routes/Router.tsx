import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Public Pages
import Home from '../pages/public/Home';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';

// Pioneer Pages
import ProjectOverview from '../pages/pioneer/ProjectOverview';
import Dashboard from '../pages/pioneer/Dashboard';
import PioneerLayout from '../layouts/PioneerLayout';
import MyProjects from '../pages/pioneer/MyProjects';
import ProjectStageLayout from '../layouts/ProjectStageLayout';
import Step1Basics from '../components/steps/Step1Basics';
import Step2Story from '../components/steps/Step2Story';
import Step3Milestone from '../components/steps/Step3Milestone';
import Step4Agreement from '../components/steps/Step4Agreement';
import Preview from '../pages/pioneer/Preview';

const Router = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/preview/:projectId' element={<Preview />} />
                </Route>

                <Route>
                    <Route element={<PioneerLayout />}>
                        <Route path='/pioneer/dashboard' element={<Dashboard />} />
                        <Route path='/pioneer/dashboard/projects' element={<MyProjects />} />
                    </Route>
                    <Route element={<MainLayout />}>
                        <Route path='/project/overview/:projectId' element={<ProjectOverview />} />
                        <Route path='/project/overview/:projectId/step' element={<ProjectStageLayout />}>
                            <Route index element={<Navigate to="1" replace />} />
                            <Route path='1' element={<Step1Basics />} />
                            <Route path='2' element={<Step2Story />} />
                            <Route path='3' element={<Step3Milestone />} />
                            <Route path='4' element={<Step4Agreement />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
            <Toaster position='top-right' />
        </BrowserRouter>
    </>
  )
}

export default Router