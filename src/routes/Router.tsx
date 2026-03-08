import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Public Pages
import Home from '../pages/public/Home';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';

// Pioneer Pages
import CreateProject from '../pages/pioneer/CreateProject';
import ProjectOverview from '../pages/pioneer/ProjectOverview';
import Dashboard from '../pages/pioneer/Dashboard';
import Projects from '../pages/pioneer/Projects';
import PioneerLayout from '../layouts/PioneerLayout';

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

                <Route>
                    <Route element={<PioneerLayout />}>
                        <Route path='/pioneer/dashboard' element={<Dashboard />} />
                        <Route path='/pioneer/dashboard/projects' element={<Projects />} />
                    </Route>
                    <Route element={<MainLayout />}>
                        <Route path='/project/overview/:projectId' element={<ProjectOverview />} />
                        <Route path='/create-project' element={<CreateProject />} />
                    </Route>
                </Route>
            </Routes>
            <Toaster position='top-right' />
        </BrowserRouter>
    </>
  )
}

export default Router