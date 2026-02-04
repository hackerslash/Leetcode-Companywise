import React from 'react';
import { Search, Moon, Sun, BarChart2 } from 'lucide-react';

export default function Sidebar({ companies, selectedCompany, onSelectCompany, companySearch, onSearchChange, darkMode, toggleDarkMode, onProfileClick }) {
  const filteredCompanies = companies.filter(c => 
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="w-full md:w-72 h-screen fixed md:relative z-10 hidden md:flex flex-col transition-colors duration-200">
      <div className="h-full m-6 rounded-3xl bg-[var(--surface)]/90 backdrop-blur border border-black/5 dark:border-white/10 shadow-[var(--shadow)] overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10 sticky top-0 z-10 bg-[var(--surface)]/90 backdrop-blur">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-display text-xl text-[var(--accent)] tracking-tight">LC Companywise</h1>
            <div className="flex items-center gap-1">
               <button
                onClick={onProfileClick}
                className="p-2 rounded-lg text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Statistics"
              >
                <BarChart2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--surface-2)] border border-black/10 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-[var(--ink)] placeholder:text-[var(--muted)]"
              value={companySearch}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredCompanies.map(company => (
            <button 
              key={company}
              onClick={() => onSelectCompany(company)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 
                ${selectedCompany === company 
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]/20' 
                  : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--ink)]'
                }`}
            >
              {company}
            </button>
          ))}
          {filteredCompanies.length === 0 && (
            <div className="p-4 text-center text-sm text-[var(--muted)]">
              No companies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
