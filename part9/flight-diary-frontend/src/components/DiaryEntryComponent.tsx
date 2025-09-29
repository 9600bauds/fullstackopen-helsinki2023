import React from 'react';
import type { DiaryEntry } from '../types';

const DiaryEntryComponent: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-gray-100">
      <h3 className="text-lg font-semibold text-blue-800 mb-1">{entry.date}</h3>
      <div className="flex flex-wrap gap-4 mb-2">
        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">
          Weather: {entry.weather}
        </span>
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
          Visibility: {entry.visibility}
        </span>
      </div>
      <p className="text-gray-700 wrap-break-word">{entry.comment}</p>
    </div>
  );
};

export default DiaryEntryComponent;
