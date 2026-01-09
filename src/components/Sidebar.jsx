import React from 'react';
import { Search } from 'lucide-react';

export default function Sidebar({ companies, selectedCompany, onSelectCompany, companySearch, onSearchChange }) {
  const filteredCompanies = companies.filter(c => 
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 bg-white shadow-lg h-screen overflow-y-auto fixed md:relative z-10 hidden md:flex flex-col border-r border-gray-200">
      <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="font-bold text-xl text-indigo-600 mb-4 tracking-tight">LC Companywise</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            {company}
          </button>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-400">
            No companies found
          </div>
        )}
      </div>
    </div>
  );
}
