// ============================================
// CASITA ADU - Type Definitions
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'client';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  project_type: 'detached' | 'attached' | 'conversion' | 'junior';
  status: 'completed' | 'in-progress';
  featured: boolean;
  cover_image: string;
  images: string[];
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  client_id: string;
  client_name?: string;
  address: string;
  project_type: string;
  status: 'planning' | 'permitting' | 'design' | 'construction' | 'inspection' | 'completed';
  progress_percent: number;
  start_date: string;
  estimated_completion: string;
  notes?: string;
  total_contract?: number;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  build_type?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  phase: string;
  images: string[];
  created_by: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  created_at: string;
}

export interface ClientDocument {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  category?: 'permit' | 'invoice' | 'receipt' | 'contract' | 'plan' | 'other';
  uploaded_by_role?: 'admin' | 'client';
  created_at: string;
}

export interface ClientMessage {
  id: string;
  project_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'admin' | 'client';
  content: string;
  read: boolean;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  icon?: string;
}

export interface ClientInvite {
  id: string;
  email: string;
  project_id: string;
  invite_token: string;
  status: 'pending' | 'accepted' | 'expired';
  invited_by: string;
  created_at: string;
  expires_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  role: 'contractor' | 'project_manager';
  full_name: string;
  company?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface PaymentMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  amount: number;
  due_date?: string;
  status: 'upcoming' | 'due' | 'paid' | 'overdue';
  paid_date?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
