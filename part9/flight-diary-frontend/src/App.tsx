import { useEffect, useState } from 'react';
import './App.css';
import type { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntryService';
import DiaryEntryComponent from './components/DiaryEntryComponent';
import NewDiaryEntryForm from './components/NewDiaryEntryForm';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const addNewEntry = (entry: DiaryEntry) => {
    setDiaryEntries(diaryEntries.concat(entry));
  };

  useEffect(() => {
    getAllDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  return (
    <div>
      <NewDiaryEntryForm addNewEntry={addNewEntry} />
      {diaryEntries.map((entry) => (
        <DiaryEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default App;
