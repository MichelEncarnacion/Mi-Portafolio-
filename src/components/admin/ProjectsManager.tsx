import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import ProjectForm from './ProjectForm';
import type { Project } from '../../lib/types';

export default function ProjectsManager() {
  const { data: projects, fetchAll, update, remove, insert } = useTable<Project>('projects');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAll('sort_order').catch(console.error);
  }, []);

  if (showForm || editingId !== null) {
    return (
      <ProjectForm
        projectId={editingId}
        onBack={() => { setEditingId(null); setShowForm(false); fetchAll('sort_order'); }}
      />
    );
  }

  const toggleStatus = async (p: Project) => {
    await update(p.id, { status: p.status === 'published' ? 'draft' : 'published' });
    fetchAll('sort_order');
  };

  const duplicate = async (p: Project) => {
    const { id, created_at, updated_at, version, ...rest } = p as Project & { created_at: string; updated_at: string };
    await insert({ ...rest, title: `${rest.title} (copy)`, slug: `${rest.slug}-copy`, status: 'draft' });
    fetchAll('sort_order');
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await remove(id);
    fetchAll('sort_order');
  };

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    for (let i = 0; i < reordered.length; i++) {
      await update(reordered[i].id, { sort_order: i } as Partial<Project>);
    }
    fetchAll('sort_order');
    setDragIndex(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg transition-all"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No projects yet</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors"
            >
              <div className="cursor-grab text-neutral-600 hover:text-neutral-400 shrink-0">
                <GripVertical size={18} />
              </div>

              <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-accent-violet/10 shrink-0 overflow-hidden">
                {project.image_url && <img src={project.image_url} alt="" className="w-full h-full object-cover" />}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{project.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">
                    {project.tags.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleStatus(project)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white" title="Toggle status">
                  {project.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => setEditingId(project.id)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white">
                  <Edit size={15} />
                </button>
                <button onClick={() => duplicate(project)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white">
                  <Copy size={15} />
                </button>
                <button onClick={() => deleteProject(project.id)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
