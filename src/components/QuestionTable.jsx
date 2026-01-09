import React from 'react';
import { ExternalLink, Check, BarChart2 } from 'lucide-react';

export default function QuestionTable({ questions, loading, solvedState, onToggleSolved, selectedCompany }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">No questions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 w-16 text-center">Status</th>
              <th className="p-4">Title</th>
              <th className="p-4 w-32">Difficulty</th>
              <th className="p-4 w-32">Acceptance</th>
              <th className="p-4 w-40">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {questions.map((q) => {
              const isSolved = (solvedState[selectedCompany] || {})[q.ID];
              return (
                <tr 
                  key={q.ID} 
                  className={`group transition-colors duration-150 ${
                    isSolved 
                      ? 'bg-green-100/50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onToggleSolved(q.ID)}
                      className={`w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center
                        ${isSolved 
                          ? 'bg-green-600 border-green-600 text-white shadow-sm scale-110' 
                          : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-green-500 dark:hover:border-green-500'
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
                      className="text-gray-900 dark:text-gray-200 font-medium hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 group-hover:underline decoration-teal-600/30 underline-offset-4"
                    >
                      {q.Title}
                      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${q.Difficulty === 'Easy' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                        q.Difficulty === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 
                        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                      {q.Difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm font-mono">{q['Acceptance %']}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 w-20 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseFloat(q['Frequency %']) > 70 ? 'bg-green-500' :
                            parseFloat(q['Frequency %']) > 40 ? 'bg-teal-500' : 'bg-gray-400'
                          }`}
                          style={{ width: q['Frequency %'] }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-8 text-right">{q['Frequency %']}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
