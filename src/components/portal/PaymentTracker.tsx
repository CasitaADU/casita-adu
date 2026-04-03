'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CheckCircle2, Clock, AlertTriangle, AlertCircle,
  DollarSign, TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { PaymentMilestone } from '@/types';

interface PaymentTrackerProps {
  projectId: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bgColor: string; label: string }> = {
  paid: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    label: 'Paid',
  },
  due: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    label: 'Due',
  },
  upcoming: {
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-50 border-gray-200',
    label: 'Upcoming',
  },
  overdue: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    label: 'Overdue',
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentTracker({ projectId }: PaymentTrackerProps) {
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);
  const [totalContract, setTotalContract] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const [milestonesRes, projectRes] = await Promise.all([
        supabase
          .from('payment_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true }),
        supabase
          .from('active_projects')
          .select('total_contract')
          .eq('id', projectId)
          .single(),
      ]);

      setMilestones(milestonesRes.data || []);
      setTotalContract(projectRes.data?.total_contract || 0);
      setLoading(false);
    };
    load();
  }, [projectId]);

  const totalPaid = milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);
  const remaining = totalContract - totalPaid;
  const paidPercent = totalContract > 0 ? (totalPaid / totalContract) * 100 : 0;

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-white border border-gray-100 p-8">
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-brand-dark-teal via-brand-mid-teal to-brand-gold" />

      <div className="p-6 lg:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-dark-teal/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-brand-dark-teal" />
              </div>
              <span className="text-xs text-brand-slate/40 font-medium">Total Contract</span>
            </div>
            <p className="font-display text-2xl text-brand-dark-teal">{formatCurrency(totalContract)}</p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-brand-slate/40 font-medium">Total Paid</span>
            </div>
            <p className="font-display text-2xl text-emerald-700">{formatCurrency(totalPaid)}</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-gold" />
              </div>
              <span className="text-xs text-brand-slate/40 font-medium">Remaining</span>
            </div>
            <p className="font-display text-2xl text-brand-charcoal">{formatCurrency(remaining)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-brand-slate/40 font-medium">Payment Progress</span>
            <span className="text-xs font-semibold text-brand-dark-teal">{Math.round(paidPercent)}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-3">
          {milestones.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-10 h-10 text-brand-slate/15 mx-auto mb-3" />
              <p className="text-sm text-brand-slate/40">No payment milestones have been set up yet.</p>
            </div>
          )}

          {milestones.map((milestone, index) => {
            const config = statusConfig[milestone.status] || statusConfig.upcoming;
            const Icon = config.icon;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                  milestone.status === 'paid' ? 'bg-emerald-50/30 border-emerald-100' :
                  milestone.status === 'overdue' ? 'bg-red-50/30 border-red-100' :
                  milestone.status === 'due' ? 'bg-amber-50/30 border-amber-100' :
                  'bg-white border-gray-100'
                }`}
              >
                {/* Status icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  milestone.status === 'paid' ? 'bg-emerald-100' :
                  milestone.status === 'overdue' ? 'bg-red-100' :
                  milestone.status === 'due' ? 'bg-amber-100' :
                  'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-brand-dark-teal truncate">{milestone.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {milestone.due_date && (
                      <span className="text-xs text-brand-slate/40">
                        Due {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                      </span>
                    )}
                    {milestone.paid_date && (
                      <span className="text-xs text-emerald-600">
                        Paid {format(new Date(milestone.paid_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-display text-lg ${
                    milestone.status === 'paid' ? 'text-emerald-700' : 'text-brand-charcoal'
                  }`}>
                    {formatCurrency(milestone.amount)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${config.bgColor} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
