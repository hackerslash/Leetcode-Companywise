import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Filter, SortAsc } from 'lucide-react';
import Sidebar from './components/Sidebar';
import QuestionTable from './components/QuestionTable';
import Stats from './components/Stats';
import ProfilePage from './components/ProfilePage';

const PERIODS = {
  'thirty-days': '30 Days',
  'three-months': '3 Months',
  'six-months': '6 Months',
  'more-than-six-months': '> 6 Months',
  'all': 'All Time'
};

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('thirty-days');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Frequency');
  const [lastUpdated, setLastUpdated] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'profile'
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [solvedState, setSolvedState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lc_solved')) || {};
    } catch {
      return {};
    }
  });

  const [solvedMeta, setSolvedMeta] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lc_solved_meta')) || {};
    } catch {
      return {};
    }
  });

  // Sync metadata for solved questions when questions are loaded or solved state changes
  useEffect(() => {
    if (questions.length === 0 || !selectedCompany) return;

    let hasUpdates = false;
    const newMeta = { ...solvedMeta };
    const companySolved = solvedState[selectedCompany.name] || {};

    questions.forEach(q => {
      const id = q.ID;
      if (companySolved[id] && !newMeta[id]) {
         newMeta[id] = {
           difficulty: q.Difficulty,
           title: q.Title
         };
         hasUpdates = true;
      }
    });

    if (hasUpdates) {
      setSolvedMeta(newMeta);
      localStorage.setItem('lc_solved_meta', JSON.stringify(newMeta));
    }
  }, [questions, solvedState, selectedCompany, solvedMeta]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetch('/companies.json')
      .then(res => res.json())
      .then(data => {
        if (data.companies) {
          // Normalize data structure: old format was array of strings, new is array of objects
          const normalizedCompanies = data.companies.map(c => 
            typeof c === 'string' ? { name: c, files: [] } : c
          );
          
          setCompanies(normalizedCompanies);
          setLastUpdated(data.lastUpdated);
          if (normalizedCompanies.length > 0) setSelectedCompany(normalizedCompanies[0]);
        } else {
          // Fallback for very old format
          const normalizedCompanies = data.map(c => ({ name: c, files: [] }));
          setCompanies(normalizedCompanies);
          if (normalizedCompanies.length > 0) setSelectedCompany(normalizedCompanies[0]);
        }
      })
      .catch(err => console.error('Failed to load companies:', err));
  }, []);

  // Determine available periods for the selected company
  const availablePeriods = useMemo(() => {
    if (!selectedCompany) return Object.keys(PERIODS);
    
    // If files info is missing (old format), assume all are available
    if (!selectedCompany.files || selectedCompany.files.length === 0) return Object.keys(PERIODS);
    
    // Filter PERIODS based on available files
    return Object.keys(PERIODS).filter(key => 
      selectedCompany.files.includes(`${key}.csv`)
    );
  }, [selectedCompany]);

  // Reset selected period if it's not available for the new company
  useEffect(() => {
    if (availablePeriods.length > 0 && !availablePeriods.includes(selectedPeriod)) {
      // Prefer 'thirty-days' -> 'three-months' -> 'six-months' -> 'all'
      const preference = ['thirty-days', 'three-months', 'six-months', 'more-than-six-months', 'all'];
      const nextPeriod = preference.find(p => availablePeriods.includes(p)) || availablePeriods[0];
      setSelectedPeriod(nextPeriod);
    }
  }, [availablePeriods, selectedPeriod]);

  useEffect(() => {
    if (!selectedCompany) return;

    // Prevent fetching if the selected period is not valid for the current company
    // This prevents 404s when switching companies with different available periods
    if (!availablePeriods.includes(selectedPeriod)) return;

    setLoading(true);
    setError('');
    const fileName = `${selectedPeriod}.csv`;
    
    fetch(`/data/${selectedCompany.name}/${fileName}`)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.error('CSV parse errors:', results.errors);
              setError('Failed to parse data for this company/period.');
              setQuestions([]);
            } else {
              setQuestions(results.data);
            }
            setLoading(false);
          },
          error: (err) => {
            console.error(err);
            setError('Failed to parse data for this company/period.');
            setQuestions([]);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load questions for this company/period.');
        setQuestions([]);
        setLoading(false);
      });
  }, [selectedCompany, selectedPeriod]);

  const toggleSolved = (id) => {
    setSolvedState(prev => {
      const companyName = selectedCompany.name;
      const newState = {
        ...prev,
        [companyName]: {
          ...(prev[companyName] || {}),
          [id]: !((prev[companyName] || {})[id])
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
    if (!selectedCompany) return 0;
    const companySolved = solvedState[selectedCompany.name] || {};
    return questions.filter(q => companySolved[q.ID]).length;
  }, [questions, solvedState, selectedCompany]);


  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
    
    return `${day}${suffix(day)} ${month}, ${year}`;
  };

  if (currentView === 'profile') {
    return (
      <ProfilePage 
        onBack={() => setCurrentView('dashboard')}
        solvedState={solvedState}
        solvedMeta={solvedMeta}
        companies={companies}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-atmosphere transition-colors duration-200 grain">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/[0.03] dark:to-white/[0.04]"></div>
      <div className="relative flex min-h-screen">
      <Sidebar 
        companies={companies.map(c => c.name)}
        selectedCompany={selectedCompany?.name || ''}
        onSelectCompany={(cName) => {
          const company = companies.find(c => c.name === cName);
          setSelectedCompany(company);
          window.scrollTo(0,0);
        }}
        companySearch={companySearch}
        onSearchChange={setCompanySearch}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onProfileClick={() => setCurrentView('profile')}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-[var(--surface)]/90 backdrop-blur-md p-4 shadow-sm z-20 flex items-center justify-between border-b border-black/5 dark:border-white/10">
          <h1 className="font-display text-lg text-[var(--accent)]">LC Companywise</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('profile')}
              className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted)]"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-xs">
                U
              </div>
            </button>
            <select 
              className="p-2 border rounded-lg bg-[var(--surface)] dark:bg-[var(--surface)] dark:text-[var(--ink)] border-black/10 dark:border-white/10 text-sm max-w-[150px]"
              value={selectedCompany?.name || ''}
              onChange={(e) => {
                const company = companies.find(c => c.name === e.target.value);
                setSelectedCompany(company);
              }}
            >
              {companies.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 md:pl-12">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <header className="rise-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-3">
                   <h2 className="text-3xl md:text-4xl font-display text-[var(--ink)] tracking-tight capitalize">
                    {selectedCompany?.name}
                   </h2>
                   <div className="flex flex-col gap-1 text-sm md:text-base">
                     <p className="text-[var(--muted)]">Curated, high-signal interview questions from {selectedCompany?.name}.</p>
                     {lastUpdated && (
                       <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                         Updated {formatDate(lastUpdated)}
                       </p>
                     )}
                   </div>
                </div>
                
                <div className="bg-[var(--surface)]/90 backdrop-blur p-1.5 rounded-2xl shadow-[var(--shadow-soft)] border border-black/5 dark:border-white/10 inline-flex flex-wrap gap-1">
                  {availablePeriods.map(key => (
                    <button
                      key={key}
                      onClick={() => setSelectedPeriod(key)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedPeriod === key 
                        ? 'bg-[var(--ink)] text-[var(--surface)] shadow-md' 
                        : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--ink)]'
                      }`}
                    >
                      {PERIODS[key]}
                    </button>
                  ))}
                </div>
              </div>

              <Stats solvedCount={solvedCount} totalCount={questions.length} />

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 md:relative z-10 bg-[var(--bg)]/80 backdrop-blur md:bg-transparent py-2 md:py-0 transition-colors duration-200">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input 
                    type="text" 
                    placeholder="Filter questions..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--surface)] border border-black/10 dark:border-white/10 rounded-2xl shadow-[var(--shadow-soft)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] dark:text-[var(--ink)] dark:placeholder-[var(--muted)]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <select 
                      className="pl-9 pr-8 py-2.5 bg-[var(--surface)] border border-black/10 dark:border-white/10 rounded-2xl shadow-[var(--shadow-soft)] text-sm appearance-none focus:ring-2 focus:ring-[var(--accent)]/20 outline-none cursor-pointer dark:text-[var(--ink)]"
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
                    <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <select 
                      className="pl-9 pr-8 py-2.5 bg-[var(--surface)] border border-black/10 dark:border-white/10 rounded-2xl shadow-[var(--shadow-soft)] text-sm appearance-none focus:ring-2 focus:ring-[var(--accent)]/20 outline-none cursor-pointer dark:text-[var(--ink)]"
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
              error={error}
              solvedState={solvedState}
              onToggleSolved={toggleSolved}
              selectedCompany={selectedCompany?.name || ''}
            />
          </div>
        </main>
      </div>
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
