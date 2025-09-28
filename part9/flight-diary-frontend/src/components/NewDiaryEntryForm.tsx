import { useState } from 'react';
import {
  weatherOptions,
  visibilityOptions,
  type Visibility,
  type Weather,
  type NewDiaryEntry,
  type DiaryEntry,
} from '../types';
import { createDiaryEntry } from '../services/diaryEntryService';

interface NewDiaryEntryFormProps {
  addNewEntry: (entry: DiaryEntry) => void;
}

const NewDiaryEntryForm = ({ addNewEntry }: NewDiaryEntryFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newWeather, setNewWeather] = useState<Weather>('sunny');
  const [newVisibility, setNewVisibility] = useState<Visibility>('great');
  const [newComment, setNewComment] = useState('');

  const resetForm = () => {
    setNewDate('');
    setNewWeather('sunny');
    setNewVisibility('great');
    setNewComment('');
  };
  const submitDiaryEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd: NewDiaryEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment,
    };
    try {
      const data = await createDiaryEntry(entryToAdd);
      addNewEntry(data);
      resetForm();
      setErrorMessage(null); // Clear previous errors
    } catch (error) {
      console.error('Failed to create diary entry:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={submitDiaryEntry}>
        <input
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
        />

        <select
          id="weatherSelect"
          value={newWeather}
          onChange={(event) => setNewWeather(event.target.value as Weather)}
        >
          {weatherOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          id="visibilitySelect"
          value={newVisibility}
          onChange={(event) =>
            setNewVisibility(event.target.value as Visibility)
          }
        >
          {visibilityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <button type="submit">add</button>
      </form>
    </div>
  );
};
export default NewDiaryEntryForm;
