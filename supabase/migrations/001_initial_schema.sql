-- ============================================
-- Michel Encarnación Portfolio — Initial Schema
-- ============================================

-- Hero Content (single row)
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  greeting_en TEXT NOT NULL DEFAULT 'Hi, I''m',
  greeting_es TEXT NOT NULL DEFAULT 'Hola, soy',
  name TEXT NOT NULL DEFAULT 'Michel Encarnación',
  tagline_en TEXT NOT NULL,
  tagline_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  profile_image_url TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  long_description_en TEXT,
  long_description_es TEXT,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  project_url TEXT,
  repo_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INT NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('languages', 'frameworks', 'databases', 'other')),
  icon TEXT,
  proficiency INT DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  years_experience TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  issuer TEXT NOT NULL,
  credential_url TEXT,
  date_obtained DATE,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  organization TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'education', 'hackathon', 'leadership')),
  start_date DATE NOT NULL,
  end_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  extra_info TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Info (single row)
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  location TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Versions (for rollback)
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  snapshot JSONB NOT NULL,
  version INT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_lookup ON content_versions(table_name, record_id, version DESC);

-- ============================================
-- Row Level Security
-- ============================================

-- Tables WITH status column
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON hero_content FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON skills FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON certifications FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON certifications FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON experience FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Tables WITHOUT status column
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read versions" ON content_versions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert versions" ON content_versions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Auto-versioning trigger
-- ============================================

CREATE OR REPLACE FUNCTION save_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_versions (table_name, record_id, snapshot, version, changed_by)
  VALUES (TG_TABLE_NAME, OLD.id, to_jsonb(OLD), OLD.version, auth.uid());
  NEW.version := OLD.version + 1;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER version_hero_content BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION save_version();

CREATE TRIGGER version_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION save_version();

CREATE TRIGGER version_experience BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION save_version();

-- ============================================
-- Storage Buckets (run in Supabase dashboard or via API)
-- ============================================
-- Note: Storage buckets must be created via Supabase dashboard:
-- 1. Create bucket "portfolio-images" (public)
-- 2. Create bucket "documents" (public)
-- Folder structure within portfolio-images: profile/, projects/, gallery/
