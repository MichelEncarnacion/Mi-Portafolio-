export interface HeroContent {
  id: string;
  greeting_en: string;
  greeting_es: string;
  name: string;
  tagline_en: string;
  tagline_es: string;
  description_en: string;
  description_es: string;
  profile_image_url: string | null;
  resume_url: string | null;
  status: 'draft' | 'published';
  version: number;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description_en: string;
  description_es: string;
  long_description_en: string | null;
  long_description_es: string | null;
  image_url: string | null;
  gallery_urls: string[];
  tags: string[];
  project_url: string | null;
  repo_url: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'databases' | 'other';
  icon: string | null;
  proficiency: number;
  years_experience: string | null;
  sort_order: number;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface Certification {
  id: string;
  title_en: string;
  title_es: string;
  issuer: string;
  credential_url: string | null;
  date_obtained: string | null;
  sort_order: number;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface Experience {
  id: string;
  title_en: string;
  title_es: string;
  organization: string;
  description_en: string;
  description_es: string;
  type: 'work' | 'education' | 'hackathon' | 'leadership';
  start_date: string;
  end_date: string | null;
  sort_order: number;
  extra_info: string | null;
  status: 'draft' | 'published';
  version: number;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  location: string | null;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  table_name: string;
  record_id: string;
  snapshot: Record<string, unknown>;
  version: number;
  changed_by: string | null;
  created_at: string;
}

export type Lang = 'en' | 'es';
