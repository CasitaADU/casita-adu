import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jahmbtbandibcvfqgnlf.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STORAGE_BUCKET = 'images';
const STORAGE_FOLDER = 'portfolio';
const SOURCE_DIR = 'C:/Users/jonme/OneDrive/Desktop/Casita-site/PROJECT GALLERY - Casita';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Skip patterns
const SKIP_PREFIXES = ['721 Oleander', '721 OLEANDER', 'Copy of', 'IMG_', 'Casita Photo', '0423'];

// Project definitions with filename matching patterns
const PROJECT_DEFS = [
  {
    patterns: [/^640 SQFT DETACHED ADU/i],
    title: '640 Sq Ft Detached ADU',
    slug: '640-sqft-detached-adu',
    project_type: 'detached',
    sqft: 640,
    bedrooms: 1,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'completed',
  },
  {
    patterns: [/^692 SQFT GARAGE CONVERSION/i],
    title: '692 Sq Ft Garage Conversion',
    slug: '692-sqft-garage-conversion',
    project_type: 'conversion',
    sqft: 692,
    bedrooms: 1,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'completed',
  },
  {
    patterns: [/^749 SQFT DETACHED AD[UY]/i],
    title: '749 Sq Ft Detached ADU',
    slug: '749-sqft-detached-adu',
    project_type: 'detached',
    sqft: 749,
    bedrooms: 2,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'completed',
  },
  {
    patterns: [/^750 SQFT DET(?:ACHED|CAHED) ADU/i],
    title: '750 Sq Ft Detached ADU',
    slug: '750-sqft-detached-adu',
    project_type: 'detached',
    sqft: 750,
    bedrooms: 2,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'completed',
    featured: true,
  },
  {
    patterns: [/^800 SQFT DETACHED ADU/i],
    title: '800 Sq Ft Detached ADU',
    slug: '800-sqft-detached-adu',
    project_type: 'detached',
    sqft: 800,
    bedrooms: 2,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'completed',
  },
  {
    patterns: [/^1000 SQFT ATTACHED ADU/i, /^1050 (?:SQFT )?ATTACHED ADU/i],
    title: '1,050 Sq Ft Attached ADU',
    slug: '1050-sqft-attached-adu',
    project_type: 'attached',
    sqft: 1050,
    bedrooms: 2,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'in-progress',
  },
  {
    patterns: [/^1200 SQFT DET(?:ACHED|CAHED) ADU/i],
    title: '1,200 Sq Ft Detached ADU',
    slug: '1200-sqft-detached-adu',
    project_type: 'detached',
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    location: 'San Diego, CA',
    status: 'completed',
  },
  {
    patterns: [/^996 SQFT 2ND STORY GARAGE CONVERSION/i],
    title: '996 Sq Ft 2nd Story Garage Conversion',
    slug: '996-sqft-2nd-story-garage-conversion',
    project_type: 'conversion',
    sqft: 996,
    bedrooms: 2,
    bathrooms: 1,
    location: 'San Diego, CA',
    status: 'in-progress',
  },
];

function shouldSkip(filename) {
  return SKIP_PREFIXES.some((p) => filename.startsWith(p));
}

function matchProject(filename) {
  for (const def of PROJECT_DEFS) {
    for (const pat of def.patterns) {
      if (pat.test(filename)) return def;
    }
  }
  return null;
}

function isExterior(filename) {
  const upper = filename.toUpperCase();
  return (
    upper.includes('EXTERIOR') ||
    upper.includes('FRONT BUILDING') ||
    upper.includes('FRONT ENTRANCE') ||
    upper.includes('FRONT DECK') ||
    upper.includes('SIDE BUILDING') ||
    upper.includes('SIDE ENTRANCE') ||
    upper.includes('LONG RANGE FRONT') ||
    upper.includes('BACKYARD') ||
    upper.includes('AERIAL') ||
    upper.includes('LANDSCAPE') ||
    upper.includes('PROJECT EXTERIOR')
  );
}

function publicUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_FOLDER}/${encodeURIComponent(filename)}`;
}

async function main() {
  console.log('Reading source directory...');
  const allFiles = fs.readdirSync(SOURCE_DIR);
  const jpgFiles = allFiles.filter((f) => /\.(jpg|jpeg)$/i.test(f));
  console.log(`Found ${jpgFiles.length} JPG files total`);

  // Filter and group
  const projectMap = new Map(); // slug -> { def, files: [] }

  for (const file of jpgFiles) {
    if (shouldSkip(file)) {
      console.log(`  SKIP: ${file}`);
      continue;
    }
    const def = matchProject(file);
    if (!def) {
      console.log(`  NO MATCH: ${file}`);
      continue;
    }
    if (!projectMap.has(def.slug)) {
      projectMap.set(def.slug, { def, files: [] });
    }
    projectMap.get(def.slug).files.push(file);
  }

  console.log(`\nMatched ${projectMap.size} projects\n`);

  // Upload all images to storage
  console.log('=== UPLOADING IMAGES TO STORAGE ===\n');
  let uploadCount = 0;
  let uploadErrors = 0;

  const allProjectFiles = [];
  for (const [, { files }] of projectMap) {
    allProjectFiles.push(...files);
  }

  for (const file of allProjectFiles) {
    const filePath = path.join(SOURCE_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `${STORAGE_FOLDER}/${file}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.log(`  UPLOAD ERROR: ${file} - ${error.message}`);
      uploadErrors++;
    } else {
      console.log(`  Uploaded: ${file}`);
      uploadCount++;
    }
  }

  console.log(`\nUploaded ${uploadCount} images (${uploadErrors} errors)\n`);

  // Insert projects into DB
  console.log('=== INSERTING PROJECTS INTO DATABASE ===\n');

  for (const [slug, { def, files }] of projectMap) {
    // Sort files: exterior first
    const exteriorFiles = files.filter((f) => isExterior(f));
    const interiorFiles = files.filter((f) => !isExterior(f));
    const sortedFiles = [...exteriorFiles, ...interiorFiles];

    // First exterior image is the cover
    const coverFile = exteriorFiles.length > 0 ? exteriorFiles[0] : sortedFiles[0];
    const coverUrl = publicUrl(coverFile);

    // All images (including cover) go into the images array
    const allUrls = sortedFiles.map((f) => publicUrl(f));

    const record = {
      title: def.title,
      slug: def.slug,
      description: '',
      location: def.location,
      sqft: def.sqft,
      bedrooms: def.bedrooms,
      bathrooms: def.bathrooms,
      project_type: def.project_type,
      status: def.status,
      featured: def.featured || false,
      cover_image: coverUrl,
      images: allUrls,
    };

    const { data, error } = await supabase
      .from('portfolio_projects')
      .upsert(record, { onConflict: 'slug' })
      .select();

    if (error) {
      console.log(`  DB ERROR [${def.title}]: ${error.message}`);
    } else {
      console.log(`  Inserted: ${def.title} (${files.length} images, cover: ${coverFile})`);
    }
  }

  console.log('\n=== DONE ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
