import { useState } from 'react';
import AuthGuard from './AuthGuard';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import HeroEditor from './HeroEditor';
import AboutEditor from './AboutEditor';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import MediaLibrary from './MediaLibrary';
import ContactInfoEditor from './ContactInfoEditor';
import ResumeUploader from './ResumeUploader';
import VersionHistory from './VersionHistory';

const SECTIONS: Record<string, () => JSX.Element> = {
  dashboard: Dashboard,
  hero: HeroEditor,
  about: AboutEditor,
  projects: ProjectsManager,
  skills: SkillsManager,
  experience: ExperienceManager,
  media: MediaLibrary,
  contact: ContactInfoEditor,
  resume: ResumeUploader,
  versions: VersionHistory,
};

export default function AdminApp() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const ActiveComponent = SECTIONS[activeSection] || Dashboard;

  return (
    <AuthGuard>
      <AdminLayout activeSection={activeSection} onNavigate={setActiveSection}>
        <ActiveComponent />
      </AdminLayout>
    </AuthGuard>
  );
}
