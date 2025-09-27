import { useEffect, useState } from 'react';
import './App.css';
import type { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';
import DiaryEntryComponent from './DiaryEntryComponent';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  return (
    <div>
      {diaryEntries.map((entry) => (
        <DiaryEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default App;
