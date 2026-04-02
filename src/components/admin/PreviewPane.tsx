import { useState } from 'react';
import { Monitor, Smartphone, X } from 'lucide-react';

interface PreviewPaneProps {
  onClose: () => void;
}

export default function PreviewPane({ onClose }: PreviewPaneProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-300">Preview</span>
          <div className="flex gap-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg ${device === 'desktop' ? 'bg-accent/20 text-accent' : 'text-neutral-400 hover:text-white'}`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg ${device === 'mobile' ? 'bg-accent/20 text-accent' : 'text-neutral-400 hover:text-white'}`}
            >
              <Smartphone size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  lang === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400">
          <X size={20} />
        </button>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-auto bg-neutral-950">
        <iframe
          src={`/?preview=true&lang=${lang}`}
          className={`bg-white rounded-xl shadow-2xl transition-all duration-300 ${
            device === 'desktop' ? 'w-full max-w-6xl h-full' : 'w-[375px] h-[812px]'
          }`}
          title="Portfolio Preview"
        />
      </div>
    </div>
  );
}
