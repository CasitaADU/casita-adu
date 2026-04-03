'use client';

import { motion } from 'framer-motion';

interface ProgressHouseProps {
  progressPercent: number;
}

const GOLD = '#C8A84B';
const DARK_TEAL = '#0C3B2E';
const MID_TEAL = '#1B6B54';
const CREAM = '#F5F0E8';
const LIGHT_GRAY = '#E8E4DC';

function getStageLabel(percent: number): string {
  if (percent <= 0) return 'Not Started';
  if (percent <= 15) return 'Foundation';
  if (percent <= 35) return 'Framing';
  if (percent <= 50) return 'Roofing';
  if (percent <= 70) return 'Exterior';
  if (percent <= 90) return 'Interior';
  return 'Complete';
}

export default function ProgressHouse({ progressPercent }: ProgressHouseProps) {
  const p = Math.max(0, Math.min(100, progressPercent));
  const stage = getStageLabel(p);

  // Animation helpers
  const show = (threshold: number) => p >= threshold;
  const fadeIn = (threshold: number, delay = 0) => ({
    initial: { opacity: 0, y: 6 },
    animate: show(threshold)
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 6 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  });

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 lg:p-8">
      <div className="flex flex-col items-center">
        {/* SVG House */}
        <svg
          viewBox="0 0 280 260"
          className="w-full max-w-[320px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ========== GROUND ========== */}
          <motion.rect
            x="20" y="220" width="240" height="8" rx="4"
            fill={LIGHT_GRAY}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{ originX: '50%', originY: '50%' }}
          />

          {/* ========== FOUNDATION (0-15%) ========== */}
          <motion.rect
            x="50" y="200" width="180" height="20" rx="3"
            fill={DARK_TEAL}
            {...fadeIn(1)}
          />
          {/* Foundation texture lines */}
          <motion.g {...fadeIn(5, 0.2)}>
            <rect x="60" y="206" width="30" height="2" rx="1" fill={MID_TEAL} opacity={0.5} />
            <rect x="100" y="210" width="25" height="2" rx="1" fill={MID_TEAL} opacity={0.5} />
            <rect x="140" y="206" width="35" height="2" rx="1" fill={MID_TEAL} opacity={0.5} />
            <rect x="185" y="210" width="30" height="2" rx="1" fill={MID_TEAL} opacity={0.5} />
          </motion.g>

          {/* ========== FRAMING (16-35%) ========== */}
          {/* Left wall frame */}
          <motion.rect
            x="50" y="110" width="6" height="90" rx="2"
            fill={DARK_TEAL}
            {...fadeIn(16)}
          />
          {/* Right wall frame */}
          <motion.rect
            x="224" y="110" width="6" height="90" rx="2"
            fill={DARK_TEAL}
            {...fadeIn(16, 0.1)}
          />
          {/* Top beam */}
          <motion.rect
            x="50" y="107" width="180" height="6" rx="2"
            fill={DARK_TEAL}
            {...fadeIn(20, 0.2)}
          />
          {/* Center stud */}
          <motion.rect
            x="137" y="110" width="6" height="90" rx="2"
            fill={DARK_TEAL}
            {...fadeIn(25, 0.15)}
          />
          {/* Cross bracing left */}
          <motion.line
            x1="56" y1="113" x2="137" y2="200"
            stroke={DARK_TEAL} strokeWidth="2" strokeDasharray="6 3"
            {...fadeIn(28, 0.25)}
          />
          {/* Cross bracing right */}
          <motion.line
            x1="224" y1="113" x2="143" y2="200"
            stroke={DARK_TEAL} strokeWidth="2" strokeDasharray="6 3"
            {...fadeIn(30, 0.3)}
          />

          {/* ========== ROOF (36-50%) ========== */}
          <motion.polygon
            points="140,45 30,110 250,110"
            fill="none"
            stroke={DARK_TEAL}
            strokeWidth="5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={show(36)
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {/* Roof fill */}
          <motion.polygon
            points="140,48 34,108 246,108"
            fill={GOLD}
            initial={{ opacity: 0 }}
            animate={show(42) ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          {/* Roof ridge detail */}
          <motion.line
            x1="140" y1="48" x2="140" y2="108"
            stroke={DARK_TEAL} strokeWidth="2" opacity={0.3}
            {...fadeIn(45, 0.4)}
          />

          {/* ========== EXTERIOR WALLS (51-70%) ========== */}
          {/* Left wall fill */}
          <motion.rect
            x="50" y="110" width="90" height="90"
            fill={CREAM}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={show(51)
              ? { opacity: 1, scaleY: 1 }
              : { opacity: 0, scaleY: 0 }
            }
            transition={{ duration: 0.5 }}
            style={{ originY: '100%' }}
          />
          {/* Right wall fill */}
          <motion.rect
            x="140" y="110" width="90" height="90"
            fill={CREAM}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={show(55)
              ? { opacity: 1, scaleY: 1 }
              : { opacity: 0, scaleY: 0 }
            }
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ originY: '100%' }}
          />
          {/* Wall border lines */}
          <motion.rect
            x="50" y="110" width="180" height="90"
            fill="none"
            stroke={DARK_TEAL} strokeWidth="3" rx="2"
            {...fadeIn(60, 0.2)}
          />
          {/* Horizontal siding lines */}
          <motion.g {...fadeIn(63, 0.3)}>
            <line x1="52" y1="140" x2="228" y2="140" stroke={DARK_TEAL} strokeWidth="0.5" opacity={0.15} />
            <line x1="52" y1="160" x2="228" y2="160" stroke={DARK_TEAL} strokeWidth="0.5" opacity={0.15} />
            <line x1="52" y1="180" x2="228" y2="180" stroke={DARK_TEAL} strokeWidth="0.5" opacity={0.15} />
          </motion.g>

          {/* ========== INTERIOR / WINDOWS & DOOR (71-90%) ========== */}
          {/* Left window */}
          <motion.g {...fadeIn(71)}>
            <rect x="70" y="135" width="35" height="30" rx="2" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
            <line x1="87.5" y1="135" x2="87.5" y2="165" stroke={DARK_TEAL} strokeWidth="1.5" />
            <line x1="70" y1="150" x2="105" y2="150" stroke={DARK_TEAL} strokeWidth="1.5" />
            {/* Window shine */}
            <rect x="73" y="138" width="12" height="9" rx="1" fill={MID_TEAL} opacity={0.08} />
          </motion.g>

          {/* Right window */}
          <motion.g {...fadeIn(75, 0.1)}>
            <rect x="175" y="135" width="35" height="30" rx="2" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
            <line x1="192.5" y1="135" x2="192.5" y2="165" stroke={DARK_TEAL} strokeWidth="1.5" />
            <line x1="175" y1="150" x2="210" y2="150" stroke={DARK_TEAL} strokeWidth="1.5" />
            <rect x="178" y="138" width="12" height="9" rx="1" fill={MID_TEAL} opacity={0.08} />
          </motion.g>

          {/* Front door */}
          <motion.g {...fadeIn(78, 0.2)}>
            <rect x="122" y="150" width="36" height="50" rx="3" fill={DARK_TEAL} />
            <rect x="125" y="153" width="30" height="44" rx="2" fill={MID_TEAL} />
            {/* Door panel details */}
            <rect x="128" y="156" width="24" height="16" rx="1.5" fill={DARK_TEAL} opacity={0.3} />
            <rect x="128" y="176" width="24" height="16" rx="1.5" fill={DARK_TEAL} opacity={0.3} />
            {/* Door knob */}
            <circle cx="149" cy="177" r="2.5" fill={GOLD} />
          </motion.g>

          {/* Door step */}
          <motion.rect
            x="116" y="198" width="48" height="4" rx="2"
            fill={DARK_TEAL} opacity={0.4}
            {...fadeIn(80, 0.3)}
          />

          {/* Roof window / dormer */}
          <motion.g {...fadeIn(85, 0.2)}>
            <circle cx="140" cy="82" r="10" fill="white" stroke={DARK_TEAL} strokeWidth="2" />
            <line x1="140" y1="72" x2="140" y2="92" stroke={DARK_TEAL} strokeWidth="1" />
            <line x1="130" y1="82" x2="150" y2="82" stroke={DARK_TEAL} strokeWidth="1" />
          </motion.g>

          {/* ========== COMPLETE / LANDSCAPING (91-100%) ========== */}
          {/* Chimney */}
          <motion.g {...fadeIn(91)}>
            <rect x="190" y="50" width="16" height="35" rx="2" fill={DARK_TEAL} />
            <rect x="187" y="47" width="22" height="5" rx="2" fill={DARK_TEAL} />
            {/* Smoke */}
            <motion.circle
              cx="198" cy="38" r="4" fill={LIGHT_GRAY}
              animate={show(93)
                ? { cy: [38, 28], opacity: [0.6, 0], scale: [1, 1.5] }
                : { opacity: 0 }
              }
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx="194" cy="35" r="3" fill={LIGHT_GRAY}
              animate={show(93)
                ? { cy: [35, 22], opacity: [0.4, 0], scale: [1, 1.3] }
                : { opacity: 0 }
              }
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </motion.g>

          {/* Left bush */}
          <motion.g {...fadeIn(92, 0.1)}>
            <ellipse cx="35" cy="215" rx="15" ry="10" fill={MID_TEAL} opacity={0.6} />
            <ellipse cx="30" cy="212" rx="10" ry="8" fill={MID_TEAL} opacity={0.4} />
          </motion.g>

          {/* Right bush */}
          <motion.g {...fadeIn(93, 0.2)}>
            <ellipse cx="248" cy="215" rx="14" ry="9" fill={MID_TEAL} opacity={0.6} />
            <ellipse cx="253" cy="212" rx="10" ry="8" fill={MID_TEAL} opacity={0.4} />
          </motion.g>

          {/* Path to door */}
          <motion.path
            d="M 128 228 Q 132 235 140 250 Q 148 235 152 228"
            fill={LIGHT_GRAY}
            stroke={DARK_TEAL} strokeWidth="0.5" opacity={0.4}
            {...fadeIn(95, 0.3)}
          />

          {/* Left flower */}
          <motion.g {...fadeIn(96, 0.2)}>
            <line x1="60" y1="220" x2="60" y2="210" stroke={MID_TEAL} strokeWidth="1.5" />
            <circle cx="60" cy="208" r="3" fill={GOLD} />
            <circle cx="56" cy="210" r="2.5" fill={GOLD} opacity={0.7} />
            <circle cx="64" cy="210" r="2.5" fill={GOLD} opacity={0.7} />
          </motion.g>

          {/* Right flower */}
          <motion.g {...fadeIn(97, 0.3)}>
            <line x1="220" y1="220" x2="220" y2="210" stroke={MID_TEAL} strokeWidth="1.5" />
            <circle cx="220" cy="208" r="3" fill={GOLD} />
            <circle cx="216" cy="210" r="2.5" fill={GOLD} opacity={0.7} />
            <circle cx="224" cy="210" r="2.5" fill={GOLD} opacity={0.7} />
          </motion.g>

          {/* Completion sparkle */}
          {show(100) && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polygon
                points="140,20 143,28 152,28 145,33 148,42 140,37 132,42 135,33 128,28 137,28"
                fill={GOLD}
              />
            </motion.g>
          )}
        </svg>

        {/* Progress bar and label */}
        <div className="w-full max-w-[320px] mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-dark-teal">{stage}</span>
            <span className="text-sm font-display text-brand-gold">{p}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${DARK_TEAL} 0%, ${MID_TEAL} 50%, ${GOLD} 100%)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${p}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-brand-slate/30 font-medium uppercase tracking-wider">
            <span>Foundation</span>
            <span>Framing</span>
            <span>Roof</span>
            <span>Exterior</span>
            <span>Interior</span>
            <span>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
