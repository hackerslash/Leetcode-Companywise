import React from 'react';
import { Trophy } from 'lucide-react';

export default function Stats({ solvedCount, totalCount }) {
  const percentage = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="card-surface dark:card-surface-dark p-5 rounded-3xl flex items-center justify-between mb-6 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-[var(--muted)] font-medium uppercase tracking-[0.2em]">Progress</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display text-[var(--ink)]">{solvedCount}</span>
            <span className="text-sm text-[var(--muted)]">/ {totalCount} questions</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-bold text-[var(--accent)]">{percentage}%</span>
        <div className="w-36 h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
