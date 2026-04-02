import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import type { Skill, Certification } from '../../lib/types';

const CATEGORIES = ['languages', 'frameworks', 'databases', 'other'] as const;

const LEVELS = [
  { label: 'Proficient', value: 80, color: 'bg-accent/20 text-accent border-accent/40' },
  { label: 'Familiar',   value: 60, color: 'bg-neutral-700 text-neutral-300 border-neutral-600' },
  { label: 'Learning',   value: 30, color: 'bg-neutral-800 text-neutral-500 border-neutral-700' },
] as const;

function proficiencyToLevel(p: number): 80 | 60 | 30 {
  if (p >= 70) return 80;
  if (p >= 50) return 60;
  return 30;
}

export default function SkillsManager() {
  const skillsHook = useTable<Skill>('skills');
  const certsHook = useTable<Certification>('certifications');
  const [certTab, setCertTab] = useState<'en' | 'es'>('en');

  useEffect(() => {
    skillsHook.fetchAll('sort_order').catch(console.error);
    certsHook.fetchAll('sort_order').catch(console.error);
  }, []);

  const addSkill = async (category: Skill['category']) => {
    await skillsHook.insert({
      name: 'New Skill',
      category,
      proficiency: 50,
      sort_order: skillsHook.data.filter((s) => s.category === category).length,
      status: 'published',
    } as Partial<Skill>);
    skillsHook.fetchAll('sort_order');
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    skillsHook.update(id, updates).catch(console.error);
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await skillsHook.remove(id);
    skillsHook.fetchAll('sort_order');
  };

  const addCert = async () => {
    await certsHook.insert({
      title_en: 'New Certification',
      title_es: 'Nueva Certificación',
      issuer: 'Issuer',
      sort_order: certsHook.data.length,
      status: 'published',
    } as Partial<Certification>);
    certsHook.fetchAll('sort_order');
  };

  const deleteCert = async (id: string) => {
    if (!confirm('Delete?')) return;
    await certsHook.remove(id);
    certsHook.fetchAll('sort_order');
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Skills & Certifications</h1>

      {CATEGORIES.map((category) => {
        const catSkills = skillsHook.data.filter((s) => s.category === category);
        return (
          <div key={category} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold capitalize">{category}</h2>
              <button
                onClick={() => addSkill(category)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {catSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900">
                  <GripVertical size={16} className="text-neutral-600 shrink-0" />
                  <input
                    type="text"
                    defaultValue={skill.name}
                    onBlur={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm focus:ring-1 focus:ring-accent outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl.label}
                        onClick={() => updateSkill(skill.id, { proficiency: lvl.value })}
                        className={`px-2 py-1 rounded-md text-xs border transition-colors ${
                          proficiencyToLevel(skill.proficiency) === lvl.value
                            ? lvl.color
                            : 'bg-transparent text-neutral-600 border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    defaultValue={skill.years_experience || ''}
                    onBlur={(e) => updateSkill(skill.id, { years_experience: e.target.value || null })}
                    placeholder="e.g. 2 years"
                    className="w-24 px-2 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-xs focus:ring-1 focus:ring-accent outline-none"
                  />
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {catSkills.length === 0 && (
                <p className="text-xs text-neutral-600 pl-2">No skills in this category</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Certifications */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold">Certifications</h2>
          <div className="flex gap-2">
            {(['en', 'es'] as const).map((l) => (
              <button key={l} onClick={() => setCertTab(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${certTab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                {l.toUpperCase()}
              </button>
            ))}
            <button onClick={addCert}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {certsHook.data.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900">
              <input
                type="text"
                defaultValue={certTab === 'en' ? cert.title_en : cert.title_es}
                onBlur={(e) => certsHook.update(cert.id, { [`title_${certTab}`]: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm focus:ring-1 focus:ring-accent outline-none"
              />
              <input
                type="text"
                defaultValue={cert.issuer}
                onBlur={(e) => certsHook.update(cert.id, { issuer: e.target.value })}
                placeholder="Issuer"
                className="w-28 px-2 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-xs"
              />
              <input
                type="url"
                defaultValue={cert.credential_url || ''}
                onBlur={(e) => certsHook.update(cert.id, { credential_url: e.target.value || null })}
                placeholder="Credential URL"
                className="w-36 px-2 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-xs"
              />
              <button onClick={() => deleteCert(cert.id)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
