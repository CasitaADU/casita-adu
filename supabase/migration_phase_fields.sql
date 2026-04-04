-- ============================================
-- MIGRATION: Add phase tracking & financial fields to active_projects
-- ============================================

-- Add new columns to active_projects
ALTER TABLE public.active_projects
  ADD COLUMN IF NOT EXISTS current_phase TEXT DEFAULT 'phase1',
  ADD COLUMN IF NOT EXISTS has_phase1 BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS has_phase2 BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS phase1_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS client_budget NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS builder_proposal NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS casita_margin_pct NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS casita_fee NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_investment NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_billed NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_remaining NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS builder_name TEXT,
  ADD COLUMN IF NOT EXISTS pm_name TEXT,
  ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Add phase column to payment_milestones for grouping
ALTER TABLE public.payment_milestones
  ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'phase1';
