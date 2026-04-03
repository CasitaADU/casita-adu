'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bell, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { ProgressUpdate } from '@/types';

interface UpdatesFeedProps {
  projectId: string;
}

const phaseColors: Record<string, { dot: string; badge: string }> = {
  planning: { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700' },
  permitting: { dot: 'bg-purple-400', badge: 'bg-purple-50 text-purple-700' },
  design: { dot: 'bg-indigo-400', badge: 'bg-indigo-50 text-indigo-700' },
  construction: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700' },
  inspection: { dot: 'bg-orange-400', badge: 'bg-orange-50 text-orange-700' },
  completed: { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700' },
};

const defaultPhaseColor = { dot: 'bg-gray-400', badge: 'bg-gray-50 text-gray-600' };

export default function UpdatesFeed({ projectId }: UpdatesFeedProps) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('progress_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      setUpdates(data || []);
      setLoading(false);
    };
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse rounded-2xl bg-white border border-gray-100 p-6">
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center mx-auto mb-4">
          <Bell className="w-7 h-7 text-brand-slate/20" />
        </div>
        <h3 className="font-display text-lg text-brand-dark-teal mb-1">No updates yet</h3>
        <p className="text-sm text-brand-slate/40 max-w-sm mx-auto">
          Your project team will post progress updates here as work progresses. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lightbox overlay */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={expandedImage}
            alt="Update photo"
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}

      {updates.map((update, index) => {
        const colors = phaseColors[update.phase] || defaultPhaseColor;

        return (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0`} />
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize ${colors.badge}`}>
                  {update.phase}
                </span>
                <span className="text-xs text-brand-slate/30 ml-auto">
                  {format(new Date(update.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-brand-dark-teal mb-2">{update.title}</h3>
              <p className="text-sm text-brand-slate/60 leading-relaxed">{update.description}</p>

              {/* Images */}
              {update.images && update.images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {update.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setExpandedImage(img)}
                      className="relative group w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 hover:border-brand-mid-teal/30 transition-colors"
                    >
                      <img src={img} alt={`Update photo ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
