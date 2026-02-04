import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowLeft, Trophy, Target, Building2 } from 'lucide-react';

export default function ProfilePage({ onBack, solvedState, companies, solvedMeta }) {
  // Calculate total solved
  const solvedStats = useMemo(() => {
    let total = 0;
    const difficultyCounts = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };
    const companyCounts = {};

    // Get all unique questions and their details
    const allSolvedIds = new Set();
    
    Object.entries(solvedState).forEach(([company, questions]) => {
      Object.entries(questions).forEach(([id, isSolved]) => {
        if (isSolved) {
           allSolvedIds.add(id);
           
           // Count per company
           companyCounts[company] = (companyCounts[company] || 0) + 1;
        }
      });
    });

    total = allSolvedIds.size;
    
    // Calculate difficulty from metadata
    allSolvedIds.forEach(id => {
        if (solvedMeta && solvedMeta[id] && solvedMeta[id].difficulty) {
            const diff = solvedMeta[id].difficulty;
            if (difficultyCounts[diff] !== undefined) {
                difficultyCounts[diff]++;
            }
        }
    });

    return { total, companyCounts, difficultyCounts };
  }, [solvedState, solvedMeta]);

  const companyData = Object.entries(solvedStats.companyCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 companies

  const difficultyData = [
      { name: 'Easy', value: solvedStats.difficultyCounts.Easy, color: '#00C49F' }, // Teal
      { name: 'Medium', value: solvedStats.difficultyCounts.Medium, color: '#FFBB28' }, // Yellow
      { name: 'Hard', value: solvedStats.difficultyCounts.Hard, color: '#FF8042' }, // Orange
  ].filter(d => d.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      if (percent < 0.05) return null; // Don't show label for small slices

      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
  };


  return (
    <div className="min-h-screen bg-atmosphere transition-colors duration-200 grain">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Questions</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-display text-[var(--ink)] mb-8">Your Progress Profile</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-surface dark:card-surface-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl text-[var(--accent)]">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Total Solved</p>
              <p className="text-3xl font-display text-[var(--ink)]">{solvedStats.total}</p>
            </div>
          </div>
          
          <div className="card-surface dark:card-surface-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-[var(--accent-2)]/15 rounded-2xl text-[var(--accent-2)]">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Companies Practiced</p>
              <p className="text-3xl font-display text-[var(--ink)]">{Object.keys(solvedStats.companyCounts).length}</p>
            </div>
          </div>

           <div className="card-surface dark:card-surface-dark p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-[var(--accent-3)]/15 rounded-2xl text-[var(--accent-3)]">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Focus Area</p>
              <p className="text-lg font-display text-[var(--ink)]">
                {companyData.length > 0 ? companyData[0].name : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Distribution */}
          <div className="card-surface dark:card-surface-dark p-6 rounded-3xl">
            <h2 className="text-lg font-display text-[var(--ink)] mb-6">Questions per Company (Top 10)</h2>
            <div className="h-[300px] w-full">
              {companyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={companyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {companyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 22, 20, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)]">
                  No data available yet
                </div>
              )}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="card-surface dark:card-surface-dark p-6 rounded-3xl">
            <h2 className="text-lg font-display text-[var(--ink)] mb-6">Difficulty Distribution</h2>
            <div className="h-[300px] w-full">
               {difficultyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 22, 20, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[var(--muted)] mb-2">
                    No difficulty data available yet.
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Visit company pages to load and track question difficulties.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
