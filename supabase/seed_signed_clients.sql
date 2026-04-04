-- ============================================
-- SEED: Signed client projects from spreadsheet
-- Run AFTER migration_phase_fields.sql
-- ============================================
-- Admin user ID: 1413c7e3-c172-46bc-8fab-18290b553cb7

-- 1. Michael Goh - Phase 2 (Daxi Way)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Michael Goh - Daxi Way', NULL, '1289 Daxi Lane, Escondido, CA 92029',
  'Detached', 'construction', 25,
  '2025-07-18', NULL, 'Daxi Way',
  1034, 275000, 'phase2', false, true,
  0, 275000, 250000, 10,
  25000, 275000, 15000, 10000,
  'Encas', 'Francisco',
  NOW(), NOW()
);

-- 2. Wen Mei and Bianca - Phase 2 (Estelle)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Wen Mei & Bianca - Estelle', NULL, '6086 Estelle St, San Diego, CA 92115',
  'Two Detached', 'construction', 20,
  '2025-07-25', NULL, 'Estelle',
  0, 522335, 'phase2', true, true,
  12500, 536000, 463487, 10,
  46349, 522335, 26452, 32397,
  'EA-VE', 'Sam',
  NOW(), NOW()
);

-- 3. Elizabeth Samford - Phase 1 (Myrtle Ave)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Elizabeth Samford - Myrtle Ave', NULL, '3360 Myrtle Ave, San Diego, CA 92104',
  'Garage Conversion', 'design', 15,
  '2025-10-20', NULL, 'Myrtle Ave',
  460, 195800, 'phase1', true, true,
  13000, 190000, 160000, 12,
  22800, 195800, 9000, 26800,
  'Encas', 'Francisco',
  NOW(), NOW()
);

-- 4. Joshua Zdunich - Phase 1 (La Jolla)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Joshua Zdunich - La Jolla', NULL, '5740 La Jolla Mesa Dr, La Jolla, CA 92037',
  'Multiple', 'design', 12,
  '2025-10-24', NULL, 'La Jolla',
  0, 495920, 'phase1', true, true,
  30000, 600000, 416000, 12,
  49920, 495920, 22000, 58200,
  NULL, 'Sam',
  NOW(), NOW()
);

-- 5. Aruna - Phase 1 (Seaview)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Aruna - Seaview', NULL, '3589 Seaview Way, Carlsbad, CA',
  'Garage Conversion', 'design', 10,
  '2025-10-24', NULL, 'Seaview',
  588, 174000, 'phase1', true, true,
  13000, 200000, 140000, 15,
  21000, 174000, 10000, 21000,
  'Encas', 'Sam',
  NOW(), NOW()
);

-- 6. Laurie and Karen - Phase 1 (Mimosa)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Laurie & Karen - Mimosa', NULL, '1042 Mimosa Ave, Vista, CA 92081',
  'Attached', 'permitting', 18,
  '2025-07-31', NULL, 'Mimosa',
  475, 185000, 'phase1', true, false,
  17000, 200000, 168000, 0,
  0, 185000, 14000, 3000,
  'Encas', 'Francisco',
  NOW(), NOW()
);

-- 7. Robert Bastien - Phase 2 (Crestview)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Robert Bastien - Crestview', NULL, '904 Crestview Rd, Vista, CA 92081',
  'Garage Conversion and Shed', 'construction', 22,
  '2025-10-23', NULL, 'Crestview',
  750, 188160, 'phase2', false, true,
  0, 200000, 168000, 12,
  20160, 188160, 27709, 12458,
  'Encas', 'Francisco',
  NOW(), NOW()
);

-- 8. Heidi McMacken - Phase 1 (Resmar)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Heidi McMacken - Resmar', NULL, '4310 Resmar Rd, La Mesa, CA 91941',
  'Detached', 'design', 8,
  '2026-01-17', NULL, 'Resmar',
  750, 369700, 'phase1', true, true,
  22500, 380000, 310000, 12,
  37200, 369700, 16500, 43200,
  NULL, 'Francisco',
  NOW(), NOW()
);

-- 9. David Torres - Phase 1 (Palm Drive)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'David Torres - Palm Drive', NULL, '317 Palm Dr, Vista, CA 92084',
  'Detached', 'planning', 5,
  '2026-02-10', NULL, 'Palm Drive',
  1200, 347500, 'phase1', true, true,
  5500, 360000, 300000, 14,
  42000, 347500, 4000, 43500,
  NULL, 'Francisco',
  NOW(), NOW()
);

-- 10. Mike Denny - Phase 1 (Eolus)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Mike Denny - Eolus', NULL, '935 Eolus Avenue, Encinitas, CA 92024',
  'Detached', 'planning', 5,
  '2026-02-20', NULL, 'Eolus',
  730, 287126, 'phase1', true, true,
  12500, 300000, 240900, 14,
  33726, 287126, 2500, 43726,
  NULL, 'Sam',
  NOW(), NOW()
);

-- 11. Debra Stef - Phase 1 (Tacoma)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Debra Stef - Tacoma', NULL, '1729 Tacoma Lane, Vista, CA 92084',
  'Detached', 'planning', 3,
  '2026-03-04', NULL, 'Tacoma',
  600, 195940, 'phase1', true, true,
  14500, 200000, 168000, 8,
  13440, 195940, 5000, 22940,
  NULL, 'Jenny',
  NOW(), NOW()
);

-- 12. Monica Arroyo - Phase 1 (Espuela)
INSERT INTO public.active_projects (
  title, client_id, address, project_type, status, progress_percent,
  start_date, estimated_completion, nickname,
  sqft, total_contract, current_phase, has_phase1, has_phase2,
  phase1_cost, client_budget, builder_proposal, casita_margin_pct,
  casita_fee, total_investment, amount_billed, balance_remaining,
  builder_name, pm_name, created_at, updated_at
) VALUES (
  'Monica Arroyo - Espuela', NULL, '248 Espuela Ln, Escondido, CA 92026',
  'Code Compliance with Addition', 'planning', 2,
  '2026-03-23', NULL, 'Espuela',
  0, 399120, 'phase1', true, true,
  6000, 400000, 364000, 8,
  29120, 399120, 1000, 34120,
  NULL, 'Francisco',
  NOW(), NOW()
);
