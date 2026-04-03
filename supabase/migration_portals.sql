-- ============================================
-- CASITA ADU - Client Portal Migration
-- ============================================
-- ADDITIVE migration — does NOT recreate existing tables.
-- Run this in Supabase SQL Editor after schema.sql is already applied.
-- Uses IF NOT EXISTS / IF NOT EXISTS column checks for idempotency.

-- ============================================
-- 1. NEW TABLE: client_invites
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  project_id UUID REFERENCES public.active_projects(id) ON DELETE CASCADE,
  invite_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

ALTER TABLE public.client_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to client_invites"
  ON public.client_invites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 2. NEW TABLE: team_members
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.active_projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('contractor', 'project_manager')),
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full CRUD on team_members"
  ON public.team_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients can view team_members for their projects"
  ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.active_projects
      WHERE id = project_id AND client_id = auth.uid()
    )
  );

-- ============================================
-- 3. NEW TABLE: payment_milestones
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.active_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due', 'paid', 'overdue')),
  paid_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full CRUD on payment_milestones"
  ON public.payment_milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients can view payment_milestones for their projects"
  ON public.payment_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.active_projects
      WHERE id = project_id AND client_id = auth.uid()
    )
  );

-- ============================================
-- 4. ALTER existing table: active_projects
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'active_projects' AND column_name = 'total_contract'
  ) THEN
    ALTER TABLE public.active_projects ADD COLUMN total_contract DECIMAL(12,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'active_projects' AND column_name = 'sqft'
  ) THEN
    ALTER TABLE public.active_projects ADD COLUMN sqft INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'active_projects' AND column_name = 'bedrooms'
  ) THEN
    ALTER TABLE public.active_projects ADD COLUMN bedrooms INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'active_projects' AND column_name = 'bathrooms'
  ) THEN
    ALTER TABLE public.active_projects ADD COLUMN bathrooms INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'active_projects' AND column_name = 'build_type'
  ) THEN
    ALTER TABLE public.active_projects ADD COLUMN build_type TEXT;
  END IF;
END
$$;

-- ============================================
-- 5. ALTER existing table: client_documents
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'client_documents' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.client_documents
      ADD COLUMN category TEXT DEFAULT 'other'
      CHECK (category IN ('permit', 'invoice', 'receipt', 'contract', 'plan', 'other'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'client_documents' AND column_name = 'uploaded_by_role'
  ) THEN
    ALTER TABLE public.client_documents
      ADD COLUMN uploaded_by_role TEXT DEFAULT 'admin'
      CHECK (uploaded_by_role IN ('admin', 'client'));
  END IF;
END
$$;

-- ============================================
-- 6. RLS: client_documents INSERT for clients
-- ============================================
-- Allow clients to upload documents to their own projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'client_documents'
      AND policyname = 'Clients can upload documents to their projects'
  ) THEN
    CREATE POLICY "Clients can upload documents to their projects"
      ON public.client_documents
      FOR INSERT WITH CHECK (
        uploaded_by = auth.uid()
        AND uploaded_by_role = 'client'
        AND EXISTS (
          SELECT 1 FROM public.active_projects
          WHERE id = project_id AND client_id = auth.uid()
        )
      );
  END IF;
END
$$;

-- ============================================
-- 7. ENABLE REALTIME for payment_milestones
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_milestones;

-- ============================================
-- DONE! New tables: client_invites, team_members, payment_milestones
-- Altered tables: active_projects, client_documents
-- ============================================
