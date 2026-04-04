-- ============================================
-- SEED: Portfolio projects with real Casita photos
-- ============================================
-- Clears existing portfolio_projects and inserts real completed projects
-- Images are referenced from /public/images/portfolio/<slug>/

-- Clear existing
DELETE FROM public.portfolio_projects;

-- 1. 750 sq ft Detached ADU 2b/2b - Vista (featured — 19 photos)
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '750 Sq Ft Detached ADU',
  '750-detached-adu-vista',
  'A modern 2 bedroom, 2 bathroom detached ADU in Vista, California. This custom-built unit features an open-concept living area, full kitchen, and private outdoor access — designed to maximize comfort on a compact footprint.',
  'Vista, CA',
  750, 2, 2, 'detached', 'completed', true,
  '/images/portfolio/p750-detached-vista/01.jpg',
  ARRAY[
    '/images/portfolio/p750-detached-vista/02.jpg',
    '/images/portfolio/p750-detached-vista/03.jpg',
    '/images/portfolio/p750-detached-vista/04.jpg',
    '/images/portfolio/p750-detached-vista/05.jpg',
    '/images/portfolio/p750-detached-vista/06.jpg',
    '/images/portfolio/p750-detached-vista/07.jpg',
    '/images/portfolio/p750-detached-vista/08.jpg',
    '/images/portfolio/p750-detached-vista/09.jpg',
    '/images/portfolio/p750-detached-vista/10.jpg',
    '/images/portfolio/p750-detached-vista/11.jpg',
    '/images/portfolio/p750-detached-vista/12.jpg',
    '/images/portfolio/p750-detached-vista/13.jpg',
    '/images/portfolio/p750-detached-vista/14.jpg',
    '/images/portfolio/p750-detached-vista/15.jpg',
    '/images/portfolio/p750-detached-vista/16.jpg',
    '/images/portfolio/p750-detached-vista/17.jpg',
    '/images/portfolio/p750-detached-vista/18.jpg',
    '/images/portfolio/p750-detached-vista/19.jpg'
  ],
  '2024-12-01'
);

-- 2. 996 sq ft Above-Garage ADU - Vista (featured — 22 photos)
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '996 Sq Ft Above-Garage ADU',
  '996-above-garage-adu-vista',
  'A beautifully finished 996 sq ft above-garage ADU in Vista, California. Full second-story build featuring a spacious living area, modern kitchen, and private entry — creating valuable living space while preserving the backyard below.',
  'Vista, CA',
  996, 2, 1, 'attached', 'completed', true,
  '/images/portfolio/p996-abovegarage-vista/01.jpg',
  ARRAY[
    '/images/portfolio/p996-abovegarage-vista/02.jpg',
    '/images/portfolio/p996-abovegarage-vista/03.jpg',
    '/images/portfolio/p996-abovegarage-vista/04.jpg',
    '/images/portfolio/p996-abovegarage-vista/05.jpg',
    '/images/portfolio/p996-abovegarage-vista/06.jpg',
    '/images/portfolio/p996-abovegarage-vista/07.jpg',
    '/images/portfolio/p996-abovegarage-vista/08.jpg',
    '/images/portfolio/p996-abovegarage-vista/09.jpg',
    '/images/portfolio/p996-abovegarage-vista/10.jpg',
    '/images/portfolio/p996-abovegarage-vista/11.jpg',
    '/images/portfolio/p996-abovegarage-vista/12.jpg',
    '/images/portfolio/p996-abovegarage-vista/13.jpg',
    '/images/portfolio/p996-abovegarage-vista/14.jpg',
    '/images/portfolio/p996-abovegarage-vista/15.jpg',
    '/images/portfolio/p996-abovegarage-vista/16.jpg',
    '/images/portfolio/p996-abovegarage-vista/17.jpg',
    '/images/portfolio/p996-abovegarage-vista/18.jpg',
    '/images/portfolio/p996-abovegarage-vista/19.jpg',
    '/images/portfolio/p996-abovegarage-vista/20.jpg',
    '/images/portfolio/p996-abovegarage-vista/21.jpg',
    '/images/portfolio/p996-abovegarage-vista/22.jpg'
  ],
  '2024-10-01'
);

-- 3. 692 sq ft Garage Conversion - Vista (featured — 21 photos)
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '692 Sq Ft Garage Conversion',
  '692-garage-conversion-vista',
  'Complete transformation of an attached garage into a stunning 692 sq ft 1-bedroom, 1-bathroom ADU in Vista, California. Features a custom kitchen, full bathroom, and all the comforts of home in previously unused space.',
  'Vista, CA',
  692, 1, 1, 'conversion', 'completed', true,
  '/images/portfolio/p692-conversion-vista/01.jpg',
  ARRAY[
    '/images/portfolio/p692-conversion-vista/02.jpg',
    '/images/portfolio/p692-conversion-vista/03.jpg',
    '/images/portfolio/p692-conversion-vista/04.jpg',
    '/images/portfolio/p692-conversion-vista/05.jpg',
    '/images/portfolio/p692-conversion-vista/06.jpg',
    '/images/portfolio/p692-conversion-vista/07.jpg',
    '/images/portfolio/p692-conversion-vista/08.jpg',
    '/images/portfolio/p692-conversion-vista/09.jpg',
    '/images/portfolio/p692-conversion-vista/10.jpg',
    '/images/portfolio/p692-conversion-vista/11.jpg',
    '/images/portfolio/p692-conversion-vista/12.jpg',
    '/images/portfolio/p692-conversion-vista/13.jpg',
    '/images/portfolio/p692-conversion-vista/14.jpg',
    '/images/portfolio/p692-conversion-vista/15.jpg',
    '/images/portfolio/p692-conversion-vista/16.jpg',
    '/images/portfolio/p692-conversion-vista/17.jpg',
    '/images/portfolio/p692-conversion-vista/18.jpg',
    '/images/portfolio/p692-conversion-vista/19.jpg',
    '/images/portfolio/p692-conversion-vista/20.jpg',
    '/images/portfolio/p692-conversion-vista/21.jpg'
  ],
  '2024-09-01'
);

-- 4. 1050 sq ft Attached ADU - San Diego
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '1050 Sq Ft Attached ADU',
  '1050-attached-adu-san-diego',
  'A spacious 1050 sq ft attached ADU with 1 bedroom and 1 bathroom in San Diego, California. Full home addition featuring custom architectural details, modern finishes, and seamless integration with the existing primary residence.',
  'San Diego, CA',
  1050, 1, 1, 'attached', 'completed', false,
  '/images/portfolio/p1050-attached-sd/01.jpg',
  ARRAY[
    '/images/portfolio/p1050-attached-sd/02.jpg',
    '/images/portfolio/p1050-attached-sd/03.jpg',
    '/images/portfolio/p1050-attached-sd/04.jpg',
    '/images/portfolio/p1050-attached-sd/05.jpg',
    '/images/portfolio/p1050-attached-sd/06.jpg',
    '/images/portfolio/p1050-attached-sd/07.jpg'
  ],
  '2024-11-01'
);

-- 5. 1200 sq ft Two-Story Attached ADU - San Diego
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '1200 Sq Ft Two-Story Attached ADU',
  '1200-two-story-adu-san-diego',
  'A striking 1200 sq ft two-story attached ADU in San Diego, California. Featuring 3 bedrooms and 2 bathrooms, this full-scale build adds significant living space with a thoughtful floor plan that makes the most of vertical space.',
  'San Diego, CA',
  1200, 3, 2, 'attached', 'completed', false,
  '/images/portfolio/p1200-twostory-sd/01.jpg',
  ARRAY['/images/portfolio/p1200-twostory-sd/02.jpg'],
  '2024-08-01'
);

-- 6. 2117 sq ft Custom Home Remodel - Escondido
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '2117 Sq Ft Custom Home Remodel',
  '2117-custom-remodel-escondido',
  'Full custom remodel of a 2117 sq ft single-family home in Escondido, California. 4 bedroom, 2 bathroom transformation featuring updated layouts, premium finishes throughout, and complete modernization of the existing structure.',
  'Escondido, CA',
  2117, 4, 2, 'detached', 'completed', false,
  '/images/portfolio/p2117-remodel-escondido/01.jpg',
  ARRAY[
    '/images/portfolio/p2117-remodel-escondido/02.jpg',
    '/images/portfolio/p2117-remodel-escondido/03.jpg',
    '/images/portfolio/p2117-remodel-escondido/04.jpg',
    '/images/portfolio/p2117-remodel-escondido/05.jpg'
  ],
  '2024-07-01'
);

-- 7. 528 sq ft Garage Conversion - Vista
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '528 Sq Ft Garage Conversion',
  '528-garage-conversion-vista',
  'Efficient garage-to-ADU conversion creating a 528 sq ft 1-bedroom, 1-bathroom unit in Vista, California. A smart, cost-effective solution that transforms underutilized garage space into a comfortable living environment.',
  'Vista, CA',
  528, 1, 1, 'conversion', 'completed', false,
  '/images/portfolio/p528-conversion-vista/01.jpg',
  ARRAY[
    '/images/portfolio/p528-conversion-vista/02.jpg',
    '/images/portfolio/p528-conversion-vista/03.jpg',
    '/images/portfolio/p528-conversion-vista/04.jpg',
    '/images/portfolio/p528-conversion-vista/05.jpg',
    '/images/portfolio/p528-conversion-vista/06.jpg',
    '/images/portfolio/p528-conversion-vista/07.jpg',
    '/images/portfolio/p528-conversion-vista/08.jpg',
    '/images/portfolio/p528-conversion-vista/09.jpg',
    '/images/portfolio/p528-conversion-vista/10.jpg',
    '/images/portfolio/p528-conversion-vista/11.jpg',
    '/images/portfolio/p528-conversion-vista/12.jpg',
    '/images/portfolio/p528-conversion-vista/13.jpg',
    '/images/portfolio/p528-conversion-vista/14.jpg',
    '/images/portfolio/p528-conversion-vista/15.jpg'
  ],
  '2024-06-01'
);

-- 8. 750 sq ft Detached ADU 2b/1b - Vista (Oleander)
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '750 Sq Ft Detached ADU — Oleander',
  '750-detached-adu-oleander-vista',
  'A clean, custom 750 sq ft detached ADU in Vista, California. 2 bedrooms, 1 bathroom with a custom kitchen, bright living spaces, and side-entry access. Designed and built as a complete standalone residence.',
  'Vista, CA',
  750, 2, 1, 'detached', 'completed', false,
  '/images/portfolio/p750-detached-oleander/01.jpg',
  ARRAY[
    '/images/portfolio/p750-detached-oleander/02.jpg',
    '/images/portfolio/p750-detached-oleander/03.jpg',
    '/images/portfolio/p750-detached-oleander/04.jpg',
    '/images/portfolio/p750-detached-oleander/05.jpg',
    '/images/portfolio/p750-detached-oleander/06.jpg',
    '/images/portfolio/p750-detached-oleander/07.jpg',
    '/images/portfolio/p750-detached-oleander/08.jpg',
    '/images/portfolio/p750-detached-oleander/09.jpg',
    '/images/portfolio/p750-detached-oleander/10.jpg',
    '/images/portfolio/p750-detached-oleander/11.jpg'
  ],
  '2024-05-01'
);

-- 9. 763 sq ft Garage Conversion + Addition - Vista (in progress)
INSERT INTO public.portfolio_projects (
  title, slug, description, location, sqft, bedrooms, bathrooms,
  project_type, status, featured, cover_image, images, completion_date
) VALUES (
  '763 Sq Ft Detached Garage Conversion + Addition',
  '763-conversion-addition-vista',
  'Garage conversion with added square footage creating a 763 sq ft 2-bedroom, 2-bathroom detached ADU in Vista, California. Currently in construction — combining conversion efficiency with the space gains of a full addition.',
  'Vista, CA',
  763, 2, 2, 'conversion', 'in-progress', false,
  '/images/portfolio/p763-conversion-vista/01.jpg',
  ARRAY[
    '/images/portfolio/p763-conversion-vista/02.jpg',
    '/images/portfolio/p763-conversion-vista/03.jpg',
    '/images/portfolio/p763-conversion-vista/04.jpg',
    '/images/portfolio/p763-conversion-vista/05.jpg',
    '/images/portfolio/p763-conversion-vista/06.jpg',
    '/images/portfolio/p763-conversion-vista/07.jpg',
    '/images/portfolio/p763-conversion-vista/08.jpg'
  ],
  NULL
);
