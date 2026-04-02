import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, Check, ImageIcon } from 'lucide-react';
import { uploadImage, deleteFile, listFiles } from '../../lib/storage';

interface MediaFile {
  name: string;
  url: string;
  metadata: unknown;
}

const FOLDERS = ['profile', 'projects', 'gallery'] as const;
type Folder = typeof FOLDERS[number];

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folder, setFolder] = useState<Folder>('projects');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      const result = await listFiles('portfolio-images', folder);
      setFiles(result);
    } catch (err) {
      console.error(err);
      setFiles([]);
    }
  }, [folder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadImage(file, folder);
      }
      await loadFiles();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete ${file.name}?`)) return;
    try {
      await deleteFile('portfolio-images', `${folder}/${file.name}`);
      await loadFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Media Library</h1>
        <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium cursor-pointer hover:shadow-lg transition-all">
          <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-2 mb-6">
        {FOLDERS.map((f) => (
          <button key={f} onClick={() => setFolder(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              folder === f ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
          <ImageIcon size={48} className="mb-4" />
          <p>No files in "{folder}"</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div key={file.name} className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="aspect-square bg-neutral-950 relative">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => copyUrl(file.url)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white" title="Copy URL">
                    {copied === file.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => handleDelete(file)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/40 text-white" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-500 truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
