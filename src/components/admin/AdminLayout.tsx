import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Type, UserRound, FolderOpen, Wrench, Briefcase,
  Image, Contact2, Inbox, FileText, History, LogOut, Eye, Menu, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useSupabase';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Content', icon: Type },
  { id: 'about', label: 'About Page', icon: UserRound },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills & Certs', icon: Wrench },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'contact', label: 'Contact Info', icon: Contact2 },
  { id: 'submissions', label: 'Submissions', icon: Inbox },
  { id: 'resume', label: 'Resume/CV', icon: FileText },
  { id: 'versions', label: 'Version History', icon: History },
];

export default function AdminLayout({ children, activeSection, onNavigate }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-neutral-800 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-heading font-bold text-black">ME</span>
          </div>
          <span className="text-sm font-heading font-semibold text-neutral-300">
            Portfolio CMS
          </span>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800 shrink-0">
          <p className="text-xs text-neutral-500 truncate mb-3 px-2">{user?.email}</p>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-800 text-neutral-400"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <Eye size={15} /> Preview Site
          </a>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
