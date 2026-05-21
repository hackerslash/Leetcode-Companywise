import React, { useState } from 'react';
import { ExternalLink, Check, Building2 } from 'lucide-react';

export default function QuestionTable({ questions, loading, error, solvedState, onToggleSolved, selectedCompany, questionCompanies = {}, onSelectCompany }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (id) => setExpandedRow(prev => prev === id ? null : id);
  if (loading) {
    return (
      <div className="card-surface dark:card-surface-dark rounded-3xl py-20 flex flex-col items-center justify-center text-[var(--muted)] animate-pulse">
        <div className="h-8 w-8 bg-black/10 dark:bg-white/10 rounded-full mb-4"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 card-surface dark:card-surface-dark rounded-3xl border border-red-200/60 dark:border-red-900/40">
        <p className="text-[var(--accent-3)] font-medium">{error}</p>
        <p className="text-sm text-[var(--muted)] mt-2">
          Try switching the time period or company.
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 card-surface dark:card-surface-dark rounded-3xl">
        <p className="text-[var(--muted)]">No questions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="card-surface dark:card-surface-dark rounded-3xl overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/5 dark:border-white/10 text-[var(--muted)] text-xs uppercase tracking-[0.2em] font-semibold">
              <th className="p-4 w-16 text-center">Done</th>
              <th className="p-4">Question</th>
              <th className="p-4 w-32">Difficulty</th>
              <th className="p-4 w-32">Acceptance</th>
              <th className="p-4 w-44">Frequency</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {questions.map((q) => {
              const isSolved = (solvedState[selectedCompany] || {})[q.ID];
              const freq = parseFloat(q['Frequency %']) || 0;
              const isExpanded = expandedRow === q.ID;
              const companies = questionCompanies[q.ID] || [];
              return (
                <React.Fragment key={q.ID}>
                  <tr
                    className={`group transition-colors duration-200 ${
                      isSolved
                        ? 'bg-[var(--accent)]/8 hover:bg-[var(--accent)]/12'
                        : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleSolved(q.ID)}
                        className={`w-6 h-6 rounded-lg border transition-all duration-200 flex items-center justify-center
                          ${isSolved
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm scale-110'
                            : 'border-black/20 dark:border-white/20 text-transparent hover:border-[var(--accent)]'
                          }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                    </td>
                    <td className="p-4">
                      <a
                        href={q.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--ink)] font-medium hover:text-[var(--accent)] inline-flex items-center gap-2 group-hover:underline decoration-[var(--accent)]/30 underline-offset-4"
                      >
                        {q.Title}
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                        ${q.Difficulty === 'Easy' ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20' :
                          q.Difficulty === 'Medium' ? 'bg-[var(--accent-2)]/15 text-[var(--accent-2)] border-[var(--accent-2)]/30' :
                          'bg-[var(--accent-3)]/15 text-[var(--accent-3)] border-[var(--accent-3)]/30'}`}>
                        {q.Difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--muted)] text-sm font-mono">{q['Acceptance %']}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 w-24 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              freq > 70 ? 'bg-[var(--accent)]' :
                              freq > 40 ? 'bg-[var(--accent-2)]' : 'bg-black/30 dark:bg-white/30'
                            }`}
                            style={{ width: q['Frequency %'] }}
                          ></div>
                        </div>
                        <span className="text-xs text-[var(--muted)] font-medium w-10 text-right">{q['Frequency %']}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {companies.length > 0 && (
                        <button
                          onClick={() => toggleExpand(q.ID)}
                          title={`Asked at ${companies.length} ${companies.length === 1 ? 'company' : 'companies'}`}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                            ${isExpanded
                              ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                              : 'text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--ink)]'
                            }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-[var(--accent)]/5 dark:bg-[var(--accent)]/8">
                      <td colSpan={6} className="px-6 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-[var(--muted)] uppercase tracking-widest mr-1">Also at</span>
                          {companies.map(company => (
                            <button
                              key={company}
                              onClick={() => { onSelectCompany(company); setExpandedRow(null); }}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface)] border border-black/10 dark:border-white/15 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150 capitalize shadow-sm"
                            >
                              {company}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
