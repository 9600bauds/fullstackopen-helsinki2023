import type { DiaryEntry } from '../types';
import DiaryEntryComponent from './DiaryEntryComponent';

const DiaryEntryList: React.FC<{ entries: DiaryEntry[] }> = ({ entries }) => {
  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <DiaryEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default DiaryEntryList;
