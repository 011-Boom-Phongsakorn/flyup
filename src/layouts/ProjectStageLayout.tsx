import { useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import Stepper from '../components/Stepper';
import { useProjectStore } from '../store/useProjectStore';

const ProjectStageLayout = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const { loadCurrentProject } = useProjectStore();

  const currentStepNum = Number(location.pathname.split('/').pop()) || 1;

  useEffect(() => {
    if (projectId) {
      loadCurrentProject(Number(projectId));
    }
  }, [projectId, loadCurrentProject]);

  return (
    <div className="w-full min-h-screen">

      <div className="bg-white-foreground">
        <Stepper currentStep={currentStepNum} />
      </div>

      <div className="max-w-[938px] mx-auto py-[22px]">
        <Breadcrumb />
      </div>

      <div className="max-w-[938px] mx-auto pb-10">
        <Outlet />
      </div>

    </div>
  );
};

export default ProjectStageLayout;