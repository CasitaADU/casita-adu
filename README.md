# Casita ADU — Modern Website + Admin & Client Portals

A modern, full-stack Next.js 14 website for **Casita ADU** — California's only full-service ADU company. Built for deployment on **Vercel** with **Supabase** as the backend.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Animations:** Framer Motion
- **Backend/Auth/DB:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Deployment:** Vercel
- **Brand Colors:** Dark Teal `#0D4A4A`, Mid Teal `#1A7A6E`, Gold `#C8A84B`

## Features

### Public Website
- Modern responsive homepage with hero, services, process, portfolio, testimonials, blog, contact
- About Us page with team bios
- Services page
- Portfolio gallery (dynamic from database)
- Blog (dynamic from database)
- Financing partners directory
- Pre-Approved Plans pages (Carlsbad, Vista)
- Contact form (saves to database)

### Admin Portal (`/admin`)
- Dashboard with stats overview
- **Portfolio Management** — Add, edit, delete showcase projects
- **Active Projects** — Create projects, assign clients, track progress
- **Progress Updates** — Send real-time updates to clients (with photos)
- **Blog Management** — Create, edit, publish/unpublish blog posts
- **Client Management** — View registered clients
- **Lead Management** — View/manage contact form submissions with status tracking
- **Messaging** — Real-time chat with clients per project
- **Settings** — Admin profile management

### Client Portal (`/portal`)
- **Dashboard** — Overview of projects, stats, recent updates
- **Project View** — Detailed progress bar, phase timeline, photo updates (real-time)
- **Documents** — Access contracts, permits, plans shared by admin
- **Messages** — Real-time chat with Casita ADU team
- 24/7 access to project status

## Quick Start

### 1. Set Up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL and keys from Settings > API

### 2. Configure Environment
```bash
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Create Admin User
1. Register at `/register`
2. Run this SQL in Supabase SQL Editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.com';
```
3. Login at `/login` — you'll be redirected to `/admin`

### 5. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Or connect your GitHub repo to Vercel and it auto-deploys.

## File Structure

```
casita-adu-web/
├── public/images/          # Static images (add your photos here)
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login & Register pages
│   │   ├── (public)/       # Public pages (about, services, etc.)
│   │   ├── admin/          # Admin portal (all CRUD pages)
│   │   ├── api/            # API routes (contact, auth callback)
│   │   ├── portal/         # Client portal (dashboard, projects, docs, messages)
│   │   ├── globals.css     # Global styles + Tailwind
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── sections/       # Homepage sections (Hero, Services, etc.)
│   ├── lib/supabase/       # Supabase client helpers (browser, server, middleware)
│   └── types/              # TypeScript interfaces
├── supabase/schema.sql     # Full database schema
├── .env.example            # Environment variables template
├── vercel.json             # Vercel config
└── package.json
```
