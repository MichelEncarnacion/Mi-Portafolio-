-- ============================================
-- Seed Data — Michel Encarnación Portfolio
-- ============================================

-- Hero Content
INSERT INTO hero_content (greeting_en, greeting_es, name, tagline_en, tagline_es, description_en, description_es, status)
VALUES (
  'Hi, I''m',
  'Hola, soy',
  'Michel Encarnación',
  'Software Engineering Student & Full-Stack Developer',
  'Estudiante de Ingeniería de Software & Desarrollador Full-Stack',
  'Passionate about building innovative solutions. Currently leading UPAEP''s satellite dashboard and serving as President of the IT Faculty Board.',
  'Apasionado por construir soluciones innovadoras. Actualmente liderando el dashboard satelital de UPAEP y Presidente de la Mesa Directiva de la Facultad de TI.',
  'published'
);

-- Projects
INSERT INTO projects (title, slug, description_en, description_es, tags, status, sort_order, start_date, end_date) VALUES
(
  'GXIBA — Satellite Metrics Web Platform',
  'gxiba-satellite-platform',
  'Lead developer for UPAEP''s satellite telemetry dashboard. Built real-time data visualization for satellite metrics using Astro and React with Supabase as the data layer.',
  'Desarrollador líder del dashboard de telemetría satelital de UPAEP. Visualización de datos en tiempo real con Astro, React y Supabase.',
  ARRAY['Astro', 'React', 'PHP', 'Tailwind', 'Supabase'],
  'published', 1, '2024-01-01', NULL
),
(
  'GYOLAP — Medical Appointment System',
  'gyolap-medical-system',
  'Full-stack web-based medical appointment system for a gynecology clinic. Features patient booking, schedule management, and a secure admin panel.',
  'Sistema web de citas médicas para clínica ginecológica. Incluye reserva de citas, gestión de horarios y panel de administración seguro.',
  ARRAY['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
  'published', 2, '2023-06-01', '2024-01-01'
),
(
  'Intelligent Parking System',
  'intelligent-parking-system',
  'Automated smart parking system to reduce waiting times. Built with Python as the core language and Arduino for real-time detection and monitoring.',
  'Sistema de estacionamiento inteligente automatizado para reducir tiempos de espera. Python como lenguaje principal y Arduino para detección en tiempo real.',
  ARRAY['Python', 'Arduino', 'IoT'],
  'published', 3, '2023-01-01', '2023-06-01'
),
(
  'Car-Dealership UX/UI',
  'car-dealership-uxui',
  'Complete responsive interface design for an automotive dealership management platform. Wireframes, high-fidelity prototypes, and interactive flows.',
  'Diseño completo de interfaz responsive para plataforma de gestión de concesionaria automotriz. Wireframes, prototipos de alta fidelidad y flujos interactivos.',
  ARRAY['Figma', 'UX/UI', 'Prototyping'],
  'published', 4, '2023-03-01', '2023-07-01'
),
(
  'ADMEX — Finance & Inventory App',
  'admex-finance-inventory',
  'UX/UI design for a mobile platform managing finances and inventory for small businesses. Usability tested with RealEye.',
  'Diseño UX/UI para plataforma móvil de gestión de finanzas e inventario para pequeños negocios. Pruebas de usabilidad con RealEye.',
  ARRAY['Figma', 'UX/UI', 'RealEye'],
  'published', 5, '2023-04-01', '2023-09-01'
),
(
  'Custom SQL ERP Database',
  'custom-sql-erp',
  'Designed and implemented a relational database with plans to scale into a customized ERP system for a small business.',
  'Diseño e implementación de base de datos relacional con planes de escalarlo a un sistema ERP personalizado.',
  ARRAY['SQL', 'Database Design', 'ERP'],
  'published', 6, '2023-02-01', '2023-05-01'
);

-- Skills — Languages
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('C / C++', 'languages', 75, '2 years', 1, 'published'),
('Java', 'languages', 60, '1 year', 2, 'published'),
('Python', 'languages', 60, '1 year', 3, 'published'),
('PHP', 'languages', 50, '6 months', 4, 'published'),
('JavaScript', 'languages', 70, NULL, 5, 'published'),
('SQL', 'languages', 75, NULL, 6, 'published'),
('HTML5 / CSS3', 'languages', 85, NULL, 7, 'published');

-- Skills — Frameworks & Tools
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('Astro', 'frameworks', 70, NULL, 1, 'published'),
('React', 'frameworks', 65, NULL, 2, 'published'),
('Tailwind CSS', 'frameworks', 80, NULL, 3, 'published'),
('Bootstrap', 'frameworks', 70, NULL, 4, 'published'),
('Figma', 'frameworks', 75, NULL, 5, 'published');

-- Skills — Databases & Backend
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('MySQL', 'databases', 75, NULL, 1, 'published'),
('Supabase', 'databases', 65, NULL, 2, 'published'),
('SQL Database Design', 'databases', 70, NULL, 3, 'published');

-- Skills — Other
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('Arduino / IoT', 'other', 55, NULL, 1, 'published'),
('Git', 'other', 70, NULL, 2, 'published'),
('UX/UI Design', 'other', 70, NULL, 3, 'published'),
('Project Management', 'other', 65, NULL, 4, 'published'),
('Network Fundamentals (CCNA)', 'other', 50, NULL, 5, 'published');

-- Certifications
INSERT INTO certifications (title_en, title_es, issuer, sort_order, status) VALUES
('CCNA v7: Introduction to Networks', 'CCNA v7: Introducción a Redes', 'Cisco', 1, 'published'),
('Database Foundations & DB Programming with SQL', 'Fundamentos de Bases de Datos y Programación SQL', 'Oracle Academy', 2, 'published');

-- Experience
INSERT INTO experience (title_en, title_es, organization, description_en, description_es, type, start_date, end_date, sort_order, extra_info, status) VALUES
(
  'President — Board of Directors, IT Faculty',
  'Presidente — Mesa Directiva, Facultad de TI',
  'UPAEP',
  'Leading and coordinating the IT faculty board. Serving as intermediary between university authorities and faculty members, ensuring proper coordination and information flow.',
  'Liderando y coordinando la mesa directiva de la facultad de TI. Intermediario entre autoridades universitarias y miembros de la facultad.',
  'leadership', '2024-06-01', NULL, 1, NULL, 'published'
),
(
  'Hackathon Participant (2023 & 2024)',
  'Participante de Hackathon (2023 y 2024)',
  'UPAEP',
  'Competed in 24-hour programming marathons using C++.',
  'Participación en maratones de programación de 24 horas en C++.',
  'hackathon', '2023-10-01', '2024-10-01', 2, NULL, 'published'
),
(
  'Software Engineering Degree',
  'Ingeniería de Software',
  'Universidad Popular Autónoma del Estado de Puebla (UPAEP)',
  'Software Engineering undergraduate program with focus on full-stack development, databases, and UX/UI design.',
  'Programa de pregrado en Ingeniería de Software con enfoque en desarrollo full-stack, bases de datos y diseño UX/UI.',
  'education', '2022-08-01', NULL, 3,
  'GPA: 9.5/10 | 60% Academic Scholarship | Graduating June 2026',
  'published'
);

-- Contact Info
INSERT INTO contact_info (email, phone, linkedin_url, github_url) VALUES
('michel.encarnacion@upaep.edu.mx', '2213411834', 'https://linkedin.com/in/michel-encarnacion', 'https://github.com/michel-encarnacion');
