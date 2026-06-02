import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}
import GoogleRoleModal from '../components/GoogleRoleModal';

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
import MilestoneDetail from '../pages/public/MilestoneDetail';
import AboutUs from '../pages/public/AboutUs';
import Terms from '../pages/public/Terms';
import HelpCenter from '../pages/public/HelpCenter';

import { Loader2 } from 'lucide-react';

// Pioneer Pages
import ProjectOverview from '../pages/pioneer/ProjectOverview';
import ProjectGuide from '../pages/pioneer/ProjectGuide';
import Dashboard from '../pages/pioneer/Dashboard';
import PioneerLayout from '../layouts/PioneerLayout';
import MyProjects from '../pages/pioneer/MyProjects';
import Profile from '../pages/pioneer/Profile';
import ProjectStageLayout from '../layouts/ProjectStageLayout';
import Step1Basics from '../components/steps/Step1Basics';
import Step2Story from '../components/steps/Step2Story';
import Step3Milestone from '../components/steps/Step3Milestone';
import Step4Agreement from '../components/steps/Step4Agreement';
import Step5Updates from '../components/steps/Step5Updates';
import Preview from '../pages/pioneer/Preview'
import MilestonePage from '../pages/pioneer/MilestonePage'
import MilestoneListPage from '../pages/pioneer/MilestoneListPage';
import PioneerMeetings from '../pages/pioneer/Meetings';
import PioneerPayouts from '../pages/pioneer/Payouts';
import PioneerProfitPage from '../pages/pioneer/PioneerProfitPage';
import CancelProjectRequest from '../pages/pioneer/CancelProjectRequest';
import PreviewMilestoneDetail from '../pages/pioneer/PreviewMilestoneDetail';

// Admin
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProjectApproval from '@/pages/admin/ProjectApproval';
import AdminProjectDetail from '@/pages/admin/AdminProjectDetail';
import VerificationApproval from '@/pages/admin/VerificationApproval';

// Booster Pages
import BoosterLayout from '../layouts/BoosterLayout';
import BoosterDashboard from '../pages/booster/Dashboard';
import BoosterMyInvestments from '../pages/booster/MyInvestments';
import BoosterInvestmentDetail from '../pages/booster/InvestmentDetail';
import BoosterMeetings from '../pages/booster/Meetings';
import BoosterVotes from '../pages/booster/Votes';
import BoosterVoteDetail from '../pages/booster/VoteDetail';
import BoosterProfits from '../pages/booster/Profits';
import BoosterRefunds from '../pages/booster/Refunds';
import BoosterComplaints from '../pages/booster/Complaints';
import BoosterComplaintDetail from '../pages/booster/ComplaintDetail';
import BoosterComplaintNew from '../pages/booster/ComplaintNew';
import BoosterProfile from '../pages/booster/Profile';
import AdminProfile from '@/pages/admin/AdminProfile'
import AdminMilestoneApproval from '@/pages/admin/AdminMilestoneApproval'
import AdminMilestoneDetail from '@/pages/admin/AdminMilestoneDetail'
import AdminProjectMilestonesOverview from '@/pages/admin/AdminProjectMilestonesOverview'
import AdminDisbursements from '@/pages/admin/AdminDisbursements'
import AdminProjectSuspension from '@/pages/admin/AdminProjectSuspension'
import AdminUserManagement from '@/pages/admin/AdminUserManagement'
import AdminComplaints from '@/pages/admin/AdminComplaints'
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs'
import AdminRefunds from '@/pages/admin/AdminRefunds';
import AdminProfitDistribution from '@/pages/admin/AdminProfitDistribution';
import AdminUniversities from '@/pages/admin/AdminUniversities';
import AdminUniversityDetail from '@/pages/admin/AdminUniversityDetail';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminCancelRequests from '@/pages/admin/AdminCancelRequests';

const PioneerGuard = () => {
    const { authUser } = useAuthStore()
    if (!authUser) return <Navigate to='/login' replace />
    if (authUser.role !== 'pioneer') return <Navigate to='/' replace />
    return <Outlet />
}

const BoosterGuard = () => {
    const { authUser } = useAuthStore()
    if (!authUser) return <Navigate to='/login' replace />
    if (authUser.role?.toLowerCase() !== 'booster') return <Navigate to='/' replace />
    return <Outlet />
}

const AdminGuard = () => {
    const { authUser } = useAuthStore()
    if (!authUser) return <Navigate to='/login' replace />
    if (authUser.role?.toLowerCase() !== 'admin') return <Navigate to='/' replace />
    return <Outlet />
}

const Router = () => {
    const { authUser, checkAuth, isCheckingAuth, loginWithGoogleToken, selectRole } = useAuthStore()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const accessToken = params.get('access_token')
        // backward compat: รองรับ ?token=1 เดิม + ?access_token=<jwt> ใหม่
        const legacyFlag = params.get('token')
        const isVerifyPage = window.location.pathname === '/verify'
        if ((accessToken || legacyFlag) && !isVerifyPage) {
            // Google OAuth flow: ใช้ loginWithGoogleToken อย่างเดียว
            // ไม่เรียก checkAuth() พร้อมกัน เพื่อป้องกัน race condition
            params.delete('access_token')
            params.delete('token')
            const newSearch = params.toString()
            window.history.replaceState({}, '', newSearch ? `?${newSearch}` : window.location.pathname)
            loginWithGoogleToken(accessToken ?? undefined)
        } else {
            checkAuth()
        }
    }, [checkAuth, loginWithGoogleToken])

    const hasUniversityDomain = !!authUser?.student_profile?.university;

    useEffect(() => {
        // Wait for /user/me to populate student_profile before deciding —
        // JWT alone doesn't contain student_profile.university, so checking
        // hasUniversityDomain too early would incorrectly default to booster.
        if (isCheckingAuth) return;
        if (authUser?.role === 'pending' && !hasUniversityDomain) {
            selectRole('booster');
        }
    }, [authUser?.role, hasUniversityDomain, selectRole, isCheckingAuth])

    const showRoleModal = authUser?.role === 'pending' && hasUniversityDomain;

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
                <ScrollToTop />
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/' />} />
                        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
                        <Route path='/forgot/password' element={!authUser ? <ForgotPassword /> : <Navigate to='/' />} />
                        <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to='/' />} />
                        <Route path='/projects' element={<Projects />} />
                        <Route path='/verify' element={<VerifyEmail />} />
                        <Route path='/projects/:slug' element={<ProjectDetail />} />
                        <Route path='/projects/:slug/invest' element={<Investment />} />
                        <Route path='/projects/:slug/milestones' element={<MilestoneDetail />} />
                        <Route path='/about/we' element={<AboutUs />} />
                        <Route path='/legal/terms' element={<Terms />} />
                        <Route path='/help' element={<HelpCenter />} />
                    </Route>

                    <Route element={<PioneerGuard />}>
                        <Route element={<PioneerLayout />}>
                            <Route path='/pioneer/dashboard' element={<Dashboard />} />
                            <Route path='/pioneer/dashboard/projects' element={<MyProjects />} />
                            <Route path='/pioneer/dashboard/milestones' element={<MilestoneListPage />} />
                            <Route path='/pioneer/dashboard/meetings' element={<PioneerMeetings />} />
                            <Route path='/pioneer/dashboard/payouts' element={<PioneerPayouts />} />
                            <Route path='/pioneer/dashboard/profit' element={<PioneerProfitPage />} />
                            <Route path='/pioneer/dashboard/projects/:projectId/cancel-request' element={<CancelProjectRequest />} />
                            <Route path='/pioneer/dashboard/projects/:projectId/milestones' element={<MilestonePage />} />
                            <Route path='/pioneer/profile' element={<Profile />} />
                        </Route>
                        <Route element={<MainLayout />}>
                            <Route path='/preview/:projectId' element={<Preview />} />
                            <Route path='/preview/:projectId/milestones' element={<PreviewMilestoneDetail />} />
                            <Route path='/project/overview/:projectId' element={<ProjectOverview />} />
                            <Route path='/project/guide' element={<ProjectGuide />} />
                            <Route path='/project/overview/:projectId/step' element={<ProjectStageLayout />}>
                                <Route index element={<Navigate to="1" replace />} />
                                <Route path='1' element={<Step1Basics />} />
                                <Route path='2' element={<Step2Story />} />
                                <Route path='3' element={<Step3Milestone />} />
                                <Route path='4' element={<Step4Agreement />} />
                                <Route path='5' element={<Step5Updates />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route element={<BoosterGuard />}>
                        <Route element={<BoosterLayout />}>
                            <Route path='/booster/dashboard' element={<BoosterDashboard />} />
                            <Route path='/booster/investments' element={<BoosterMyInvestments />} />
                            <Route path='/booster/investments/:id' element={<BoosterInvestmentDetail />} />
                            <Route path='/booster/meetings' element={<BoosterMeetings />} />
                            <Route path='/booster/votes' element={<BoosterVotes />} />
                            <Route path='/booster/votes/:id' element={<BoosterVoteDetail />} />
                            <Route path='/booster/profits' element={<BoosterProfits />} />
                            <Route path='/booster/refunds' element={<BoosterRefunds />} />
                            <Route path='/booster/complaints' element={<BoosterComplaints />} />
                            <Route path='/booster/complaints/new' element={<BoosterComplaintNew />} />
                            <Route path='/booster/complaints/:id' element={<BoosterComplaintDetail />} />
                            <Route path='/booster/profile' element={<BoosterProfile />} />
                        </Route>
                    </Route>

                    <Route element={<AdminGuard />}>
                        <Route element={<AdminLayout />}>
                            <Route path='/admin/dashboard' element={<AdminDashboard />} />
                            <Route path='/admin/projects-approval' element={<ProjectApproval />} />
                            <Route path='/admin/projects/:id' element={<AdminProjectDetail />} />
                            <Route path='/admin/projects/:id/milestones-overview' element={<AdminProjectMilestonesOverview />} />
                            <Route path='/admin/verifications' element={<VerificationApproval />} />
                            <Route path='/admin/milestones' element={<AdminMilestoneApproval />} />
                            <Route path='/admin/milestones/:milestoneId' element={<AdminMilestoneDetail />} />
                            <Route path='/admin/refunds' element={<AdminRefunds />} />
                            <Route path='/admin/disbursements' element={<AdminDisbursements />} />
                            <Route path='/admin/profit-distribution' element={<AdminProfitDistribution />} />
                            <Route path='/admin/projects-suspension' element={<AdminProjectSuspension />} />
                            <Route path='/admin/users' element={<AdminUserManagement />} />
                            <Route path='/admin/complaints' element={<AdminComplaints />} />
                            <Route path='/admin/audit-logs' element={<AdminAuditLogs />} />
                            <Route path='/admin/universities' element={<AdminUniversities />} />
                            <Route path='/admin/universities/:id' element={<AdminUniversityDetail />} />
                            <Route path='/admin/categories' element={<AdminCategories />} />
                            <Route path='/admin/cancel-requests' element={<AdminCancelRequests />} />
                            <Route path='/admin/profile' element={<AdminProfile />} />
                        </Route>
                    </Route>

                </Routes>
                <GoogleRoleModal open={showRoleModal} onClose={() => {}} />
                <Toaster
                    position='bottom-right'
                    containerStyle={{ bottom: 24, right: 24 }}
                />
            </BrowserRouter>
        </>
    )
}

export default Router
