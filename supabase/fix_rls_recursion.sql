-- ============================================
-- FIX: Infinite recursion in RLS policies
-- ============================================
-- The "Admins can manage all profiles" policy queries profiles
-- to check admin role, which triggers itself infinitely.
-- Fix: Use a SECURITY DEFINER function that bypasses RLS.

-- Step 1: Create a helper function (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'admin')
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Fix profiles table policy
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Step 3: Fix all other tables that had the same recursive pattern
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_projects;
CREATE POLICY "Admins can manage portfolio" ON public.portfolio_projects
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage all projects" ON public.active_projects;
CREATE POLICY "Admins manage all projects" ON public.active_projects
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage all updates" ON public.progress_updates;
CREATE POLICY "Admins manage all updates" ON public.progress_updates
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins see all posts" ON public.blog_posts;
CREATE POLICY "Admins see all posts" ON public.blog_posts
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage posts" ON public.blog_posts;
CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage submissions" ON public.contact_submissions;
CREATE POLICY "Admins manage submissions" ON public.contact_submissions
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage documents" ON public.client_documents;
CREATE POLICY "Admins manage documents" ON public.client_documents
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage all messages" ON public.client_messages;
CREATE POLICY "Admins manage all messages" ON public.client_messages
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins full access to invites" ON public.client_invites;
CREATE POLICY "Admins full access to invites" ON public.client_invites
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins full access to team_members" ON public.team_members;
CREATE POLICY "Admins full access to team_members" ON public.team_members
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins full access to payment_milestones" ON public.payment_milestones;
CREATE POLICY "Admins full access to payment_milestones" ON public.payment_milestones
  FOR ALL USING (public.is_admin(auth.uid()));
