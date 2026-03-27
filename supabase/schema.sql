-- ============================================
-- CASITA ADU - Supabase Database Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates all tables, RLS policies, and seed data needed.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. PORTFOLIO PROJECTS (public showcase)
-- ============================================
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  sqft INTEGER DEFAULT 0,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  project_type TEXT DEFAULT 'detached' CHECK (project_type IN ('detached', 'attached', 'conversion', 'junior')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress')),
  featured BOOLEAN DEFAULT false,
  cover_image TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio visible to everyone" ON public.portfolio_projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage portfolio" ON public.portfolio_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 3. ACTIVE PROJECTS (client-linked)
-- ============================================
CREATE TABLE IF NOT EXISTS public.active_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES public.profiles(id),
  client_name TEXT,
  address TEXT DEFAULT '',
  project_type TEXT DEFAULT 'detached',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'permitting', 'design', 'construction', 'inspection', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  start_date DATE,
  estimated_completion DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.active_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own projects" ON public.active_projects
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins manage all projects" ON public.active_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. PROGRESS UPDATES
-- ============================================
CREATE TABLE IF NOT EXISTS public.progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.active_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  phase TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see updates for own projects" ON public.progress_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.active_projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Admins manage all updates" ON public.progress_updates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  author TEXT DEFAULT 'Casita ADU',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts visible to everyone" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins see all posts" ON public.blog_posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 6. CONTACT SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage submissions" ON public.contact_submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow anonymous inserts for contact form
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 7. CLIENT DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.active_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT '',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own documents" ON public.client_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.active_projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Admins manage documents" ON public.client_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 8. CLIENT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.active_projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  sender_name TEXT DEFAULT '',
  sender_role TEXT DEFAULT 'client' CHECK (sender_role IN ('admin', 'client')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see messages for own projects" ON public.client_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.active_projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Clients can send messages" ON public.client_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND sender_role = 'client'
  );

CREATE POLICY "Clients can mark messages as read" ON public.client_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.active_projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Admins manage all messages" ON public.client_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 9. ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.progress_updates;

-- ============================================
-- DONE! Now create your first admin user:
-- 1. Sign up via the app's /register page
-- 2. Run this SQL to promote yourself to admin:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.com';
-- ============================================
