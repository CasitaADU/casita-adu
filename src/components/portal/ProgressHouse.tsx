'use client';

import { motion } from 'framer-motion';

interface ProgressHouseProps {
  progressPercent: number;
  currentPhase?: string;
  hasPhase1?: boolean;
  hasPhase2?: boolean;
}

const GOLD = '#C8A84B';
const DARK_TEAL = '#0C3B2E';
const MID_TEAL = '#1B6B54';
const CREAM = '#F5F0E8';
const LIGHT_GRAY = '#E8E4DC';

// Phase 1 milestones (Design & Permitting)
const phase1Steps = [
  { label: 'Site Assessment', range: [0, 8] },
  { label: 'Design', range: [8, 20] },
  { label: 'Plan Submission', range: [20, 30] },
  { label: 'Permitting', range: [30, 45] },
  { label: 'Approved', range: [45, 50] },
];

// Phase 2 milestones (Construction)
const phase2Steps = [
  { label: 'Foundation', range: [50, 58] },
  { label: 'Framing', range: [58, 68] },
  { label: 'Rough-In', range: [68, 75] },
  { label: 'Exterior', range: [75, 82] },
  { label: 'Interior', range: [82, 90] },
  { label: 'Final Inspection', range: [90, 95] },
  { label: 'Complete', range: [95, 100] },
];

function getStageLabel(percent: number): string {
  if (percent <= 0) return 'Not Started';
  for (const step of [...phase1Steps, ...phase2Steps]) {
    if (percent >= step.range[0] && percent < step.range[1]) return step.label;
  }
  if (percent >= 100) return 'Complete';
  return 'In Progress';
}

export default function ProgressHouse({ progressPercent, currentPhase, hasPhase1 = true, hasPhase2 = true }: ProgressHouseProps) {
  const p = Math.max(0, Math.min(100, progressPercent));
  const stage = getStageLabel(p);
  const inPhase1 = currentPhase === 'phase1' || p < 50;

  const draw = (delay = 0) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.2, delay, ease: 'easeInOut' },
  });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  });

  const scaleIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] },
  });

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 lg:p-8">
      <div className="flex flex-col items-center">
        {/* SVG House — Clean, minimal style */}
        <svg viewBox="0 0 240 200" className="w-full max-w-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Ground line */}
          <motion.line
            x1="20" y1="170" x2="220" y2="170"
            stroke={LIGHT_GRAY} strokeWidth="3" strokeLinecap="round"
            {...draw(0)}
          />

          {/* Foundation */}
          <motion.rect
            x="45" y="155" width="150" height="15" rx="2"
            fill={DARK_TEAL}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: p >= 2 ? 1 : 0, opacity: p >= 2 ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ originX: '50%' }}
          />

          {/* Wall outline — draws in */}
          <motion.rect
            x="50" y="75" width="140" height="80" rx="2"
            fill="none" stroke={DARK_TEAL} strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: p >= 10 ? 1 : 0, opacity: p >= 10 ? 1 : 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
          />

          {/* Wall fill — fades in after outline */}
          <motion.rect
            x="51" y="76" width="138" height="78"
            fill={CREAM}
            initial={{ opacity: 0 }}
            animate={{ opacity: p >= 20 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          {/* Roof outline */}
          <motion.path
            d="M 35 78 L 120 25 L 205 78"
            fill="none" stroke={DARK_TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: p >= 25 ? 1 : 0, opacity: p >= 25 ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
          />

          {/* Roof fill */}
          <motion.polygon
            points="120,28 38,76 202,76"
            fill={GOLD}
            initial={{ opacity: 0 }}
            animate={{ opacity: p >= 30 ? 0.9 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />

          {/* Door */}
          <motion.g {...fadeUp(0.4)}>
            {p >= 40 && (
              <>
                <rect x="103" y="110" width="34" height="45" rx="2" fill={DARK_TEAL} />
                <rect x="106" y="113" width="28" height="39" rx="1.5" fill={MID_TEAL} />
                <motion.circle
                  cx="129" cy="133" r="2" fill={GOLD}
                  {...scaleIn(0.8)}
                />
              </>
            )}
          </motion.g>

          {/* Left window */}
          {p >= 45 && (
            <motion.g {...scaleIn(0.5)}>
              <rect x="65" y="100" width="28" height="24" rx="2" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
              <line x1="79" y1="100" x2="79" y2="124" stroke={DARK_TEAL} strokeWidth="1.5" />
              <line x1="65" y1="112" x2="93" y2="112" stroke={DARK_TEAL} strokeWidth="1.5" />
            </motion.g>
          )}

          {/* Right window */}
          {p >= 50 && (
            <motion.g {...scaleIn(0.6)}>
              <rect x="147" y="100" width="28" height="24" rx="2" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
              <line x1="161" y1="100" x2="161" y2="124" stroke={DARK_TEAL} strokeWidth="1.5" />
              <line x1="147" y1="112" x2="175" y2="112" stroke={DARK_TEAL} strokeWidth="1.5" />
            </motion.g>
          )}

          {/* Dormer window */}
          {p >= 60 && (
            <motion.g {...scaleIn(0.4)}>
              <circle cx="120" cy="55" r="9" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
              <line x1="120" y1="46" x2="120" y2="64" stroke={DARK_TEAL} strokeWidth="1" />
              <line x1="111" y1="55" x2="129" y2="55" stroke={DARK_TEAL} strokeWidth="1" />
            </motion.g>
          )}

          {/* Chimney */}
          {p >= 75 && (
            <motion.g {...fadeUp(0.3)}>
              <rect x="165" y="30" width="14" height="30" rx="2" fill={DARK_TEAL} />
              <rect x="162" y="27" width="20" height="5" rx="2" fill={DARK_TEAL} />
              {p >= 85 && (
                <>
                  <motion.circle
                    cx="172" cy="20" r="3.5" fill={LIGHT_GRAY}
                    animate={{ cy: [20, 10], opacity: [0.5, 0], scale: [1, 1.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.circle
                    cx="169" cy="17" r="2.5" fill={LIGHT_GRAY}
                    animate={{ cy: [17, 5], opacity: [0.3, 0], scale: [1, 1.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
                  />
                </>
              )}
            </motion.g>
          )}

          {/* Landscaping */}
          {p >= 90 && (
            <>
              <motion.ellipse cx="35" cy="167" rx="12" ry="8" fill={MID_TEAL} opacity={0.5} {...scaleIn(0.2)} />
              <motion.ellipse cx="205" cy="167" rx="11" ry="7" fill={MID_TEAL} opacity={0.5} {...scaleIn(0.3)} />
            </>
          )}

          {/* Path to door */}
          {p >= 92 && (
            <motion.path
              d="M 112 170 Q 116 178 120 190 Q 124 178 128 170"
              fill={LIGHT_GRAY} opacity={0.5}
              {...fadeUp(0.2)}
            />
          )}

          {/* Completion star burst */}
          {p >= 100 && (
            <motion.g
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: [0, 1, 0.8], scale: [0.3, 1.1, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              style={{ originX: '120px', originY: '10px' }}
            >
              <polygon
                points="120,2 123,10 131,10 124,15 127,23 120,18 113,23 116,15 109,10 117,10"
                fill={GOLD}
              />
            </motion.g>
          )}
        </svg>

        {/* Stage label */}
        <div className="w-full max-w-[300px] mt-4 mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-dark-teal">{stage}</span>
          <span className="text-sm font-display text-brand-gold">{p}%</span>
        </div>

        {/* Phase Progress Bars */}
        <div className="w-full max-w-[300px] space-y-4">
          {/* Phase 1 */}
          {hasPhase1 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  inPhase1 ? 'text-brand-dark-teal' : 'text-brand-slate/30'
                }`}>
                  Phase 1 — Design & Permits
                </span>
                <span className={`text-[10px] font-medium ${
                  p >= 50 ? 'text-emerald-500' : 'text-brand-slate/30'
                }`}>
                  {p >= 50 ? 'Complete' : `${Math.round(Math.min(p / 50 * 100, 100))}%`}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${DARK_TEAL}, ${MID_TEAL})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(p / 50 * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-1">
                {phase1Steps.map((step, i) => (
                  <span key={i} className={`text-[8px] tracking-wide ${
                    p >= step.range[0] ? 'text-brand-dark-teal/60' : 'text-brand-slate/20'
                  }`}>
                    {step.label.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Phase 2 */}
          {hasPhase2 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  !inPhase1 && p < 100 ? 'text-brand-dark-teal' : p >= 100 ? 'text-emerald-600' : 'text-brand-slate/30'
                }`}>
                  Phase 2 — Construction
                </span>
                <span className={`text-[10px] font-medium ${
                  p >= 100 ? 'text-emerald-500' : p > 50 ? 'text-brand-gold' : 'text-brand-slate/30'
                }`}>
                  {p >= 100 ? 'Complete' : p <= 50 ? 'Upcoming' : `${Math.round(((p - 50) / 50) * 100)}%`}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${MID_TEAL}, ${GOLD})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(((p - 50) / 50) * 100, 100))}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                {phase2Steps.filter((_, i) => i % 2 === 0 || i === phase2Steps.length - 1).map((step, i) => (
                  <span key={i} className={`text-[8px] tracking-wide ${
                    p >= step.range[0] ? 'text-brand-dark-teal/60' : 'text-brand-slate/20'
                  }`}>
                    {step.label.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
