import React from 'react';
import { Search, Moon, Sun, UserCircle } from 'lucide-react';

export default function Sidebar({ companies, selectedCompany, onSelectCompany, companySearch, onSearchChange, darkMode, toggleDarkMode, onProfileClick }) {
  const filteredCompanies = companies.filter(c => 
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg h-screen overflow-y-auto fixed md:relative z-10 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-xl text-teal-600 dark:text-teal-400 tracking-tight">LC Companywise</h1>
          <div className="flex items-center gap-1">
             <button
              onClick={onProfileClick}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="User Profile"
            >
              <UserCircle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:text-gray-200 dark:placeholder-gray-500"
            value={companySearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filteredCompanies.map(company => (
          <button 
            key={company}
            onClick={() => onSelectCompany(company)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${selectedCompany === company 
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 shadow-sm ring-1 ring-teal-200 dark:ring-teal-700' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            {company}
          </button>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
            No companies found
          </div>
        )}
      </div>
    </div>
  );
}
