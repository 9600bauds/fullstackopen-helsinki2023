import { useEffect, useState } from 'react';
import './App.css';
import type { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';
import NewDiaryEntryForm from './components/NewDiaryEntryForm';
import DiaryEntryList from './components/DiaryEntryList';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const addNewEntry = (entry: DiaryEntry, toFront = true) => {
    if (toFront) {
      setDiaryEntries([entry].concat(diaryEntries));
    } else {
      setDiaryEntries(diaryEntries.concat(entry));
    }
  };

  useEffect(() => {
    getAllDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-0 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Flight Diary</h1>
        <h2 className="text-xl font-semibold mb-2">Add new entry</h2>
        <NewDiaryEntryForm addNewEntry={addNewEntry} />
        <h2 className="text-xl font-semibold mt-8 mb-2">Diary entries</h2>
        <DiaryEntryList entries={diaryEntries} />
      </div>
    </div>
  );
};

export default App;
