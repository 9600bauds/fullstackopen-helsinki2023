import React from 'react';
import type { DiaryEntry } from '../types';

const DiaryEntryComponent: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>Weather: {entry.weather}</p>
      <p>Visibility: {entry.visibility}</p>
      <p>Comment: {entry.comment}</p>
    </div>
  );
};

export default DiaryEntryComponent;
