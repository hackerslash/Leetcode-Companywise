import React from 'react';
import { ExternalLink, Check, BarChart2 } from 'lucide-react';

export default function QuestionTable({ questions, loading, solvedState, onToggleSolved, selectedCompany }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-500">No questions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 w-16 text-center">Status</th>
              <th className="p-4">Title</th>
              <th className="p-4 w-32">Difficulty</th>
              <th className="p-4 w-32">Acceptance</th>
              <th className="p-4 w-40">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {questions.map((q) => {
              const isSolved = (solvedState[selectedCompany] || {})[q.ID];
              return (
                <tr 
                  key={q.ID} 
                  className={`group transition-colors duration-150 ${
                    isSolved ? 'bg-green-50/50 hover:bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onToggleSolved(q.ID)}
                      className={`w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center
                        ${isSolved 
                          ? 'bg-green-500 border-green-500 text-white shadow-sm scale-110' 
                          : 'border-gray-300 text-transparent hover:border-green-400'
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
                      className="text-gray-900 font-medium hover:text-indigo-600 inline-flex items-center gap-1 group-hover:underline decoration-indigo-600/30 underline-offset-4"
                    >
                      {q.Title}
                      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${q.Difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' : 
                        q.Difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {q.Difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm font-mono">{q['Acceptance %']}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 w-20 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseFloat(q['Frequency %']) > 70 ? 'bg-green-500' :
                            parseFloat(q['Frequency %']) > 40 ? 'bg-indigo-500' : 'bg-gray-400'
                          }`}
                          style={{ width: q['Frequency %'] }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-8 text-right">{q['Frequency %']}</span>
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
