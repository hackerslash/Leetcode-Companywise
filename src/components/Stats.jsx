import React from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

export default function Stats({ solvedCount, totalCount }) {
  const percentage = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Progress</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{solvedCount}</span>
            <span className="text-sm text-gray-400">/ {totalCount} questions</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
