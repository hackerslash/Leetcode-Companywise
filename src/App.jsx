import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Filter, SortAsc, LayoutList } from 'lucide-react';
import Sidebar from './components/Sidebar';
import QuestionTable from './components/QuestionTable';
import Stats from './components/Stats';

const PERIODS = {
  'thirty-days': '30 Days',
  'three-months': '3 Months',
  'six-months': '6 Months',
  'more-than-six-months': '> 6 Months',
  'all': 'All Time'
};

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('thirty-days');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Frequency');
  
  const [solvedState, setSolvedState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lc_solved')) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    fetch('/companies.json')
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        if (data.length > 0) setSelectedCompany(data[0]);
      })
      .catch(err => console.error('Failed to load companies:', err));
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    setLoading(true);
    const fileName = `${selectedPeriod}.csv`;
    
    fetch(`/data/${selectedCompany}/${fileName}`)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setQuestions(results.data);
            setLoading(false);
          },
          error: (err) => {
            console.error(err);
            setQuestions([]);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error(err);
        setQuestions([]);
        setLoading(false);
      });
  }, [selectedCompany, selectedPeriod]);

  const toggleSolved = (id) => {
    setSolvedState(prev => {
      const newState = {
        ...prev,
        [selectedCompany]: {
          ...(prev[selectedCompany] || {}),
          [id]: !((prev[selectedCompany] || {})[id])
        }
      };
      localStorage.setItem('lc_solved', JSON.stringify(newState));
      return newState;
    });
  };

  const processedQuestions = useMemo(() => {
    let filtered = questions.filter(q => {
      const matchesSearch = q.Title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiff = difficultyFilter === 'All' || q.Difficulty === difficultyFilter;
      return matchesSearch && matchesDiff;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'Frequency') {
        const freqA = parseFloat(a['Frequency %']) || 0;
        const freqB = parseFloat(b['Frequency %']) || 0;
        return freqB - freqA;
      }
      if (sortBy === 'Title') return a.Title.localeCompare(b.Title);
      const diffMap = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return diffMap[a.Difficulty] - diffMap[b.Difficulty];
    });
  }, [questions, searchTerm, difficultyFilter, sortBy]);

  const solvedCount = useMemo(() => {
    const companySolved = solvedState[selectedCompany] || {};
    return questions.filter(q => companySolved[q.ID]).length;
  }, [questions, solvedState, selectedCompany]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar 
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={(c) => {
          setSelectedCompany(c);
          window.scrollTo(0,0);
        }}
        companySearch={companySearch}
        onSearchChange={setCompanySearch}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 shadow-sm z-20 flex items-center justify-between">
          <h1 className="font-bold text-lg text-indigo-600">LC Companywise</h1>
          <select 
            className="p-2 border rounded-lg bg-gray-50 text-sm max-w-[200px]"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pl-10">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <header>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                   <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize mb-2">
                    {selectedCompany}
                   </h2>
                   <p className="text-gray-500">Practice most frequent questions asked by {selectedCompany}</p>
                </div>
                
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex flex-wrap gap-1">
                  {Object.entries(PERIODS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPeriod(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPeriod === key 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Stats solvedCount={solvedCount} totalCount={questions.length} />

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 md:relative z-10 bg-gray-50 md:bg-transparent py-2 md:py-0">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filter questions..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                      value={difficultyFilter}
                      onChange={e => setDifficultyFilter(e.target.value)}
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="relative">
                    <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="Frequency">Frequency</option>
                      <option value="Difficulty">Difficulty</option>
                      <option value="Title">Title</option>
                    </select>
                  </div>
                </div>
              </div>
            </header>

            <QuestionTable 
              questions={processedQuestions} 
              loading={loading}
              solvedState={solvedState}
              onToggleSolved={toggleSolved}
              selectedCompany={selectedCompany}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  )
}

export default App;
