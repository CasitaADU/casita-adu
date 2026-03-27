'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Download, File, Image, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import type { ClientDocument } from '@/types';

const fileIcon = (type: string) => {
  if (type?.includes('image')) return <Image className="w-5 h-5 text-pink-500" />;
  if (type?.includes('spreadsheet') || type?.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-blue-500" />;
};

export default function PortalDocuments() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: projects } = await supabase.from('active_projects').select('id').eq('client_id', user.id);
      if (projects && projects.length > 0) {
        const ids = projects.map(p => p.id);
        const { data } = await supabase.from('client_documents').select('*').in('project_id', ids).order('created_at', { ascending: false });
        setDocuments(data || []);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">Documents</h1>
        <p className="text-brand-slate/50 text-sm">Access contracts, permits, plans, and other project documents shared by our team.</p>
      </div>

      {documents.length === 0 ? (
        <div className="portal-card text-center py-16">
          <FileText className="w-12 h-12 text-brand-slate/20 mx-auto mb-4" />
          <p className="text-brand-slate/40">No documents shared yet. Documents will appear here as your project progresses.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  {fileIcon(doc.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-dark-teal text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-brand-slate/40">
                    {doc.file_type} · Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-brand-dark-teal/5 text-brand-mid-teal hover:bg-brand-dark-teal/10 transition-colors">
                  <Download className="w-3 h-3" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
