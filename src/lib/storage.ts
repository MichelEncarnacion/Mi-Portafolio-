import { supabase } from './supabase';

const IMAGE_BUCKET = 'portfolio-images';
const DOCS_BUCKET = 'documents';

export async function uploadImage(
  file: File,
  folder: 'profile' | 'projects' | 'gallery'
): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function uploadDocument(file: File): Promise<string> {
  const fileName = `resume/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(DOCS_BUCKET)
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(DOCS_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function listFiles(
  bucket: string,
  folder: string
): Promise<Array<{ name: string; url: string; metadata: unknown }>> {
  const { data, error } = await supabase.storage.from(bucket).list(folder);
  if (error) throw error;

  return (data || []).map((file) => {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${folder}/${file.name}`);
    return {
      name: file.name,
      url: urlData.publicUrl,
      metadata: file.metadata,
    };
  });
}
