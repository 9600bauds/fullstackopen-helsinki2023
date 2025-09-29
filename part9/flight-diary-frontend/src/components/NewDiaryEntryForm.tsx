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
  const clearError = () => {
    setErrorMessage(null);
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
      clearError();
    } catch (error) {
      console.error('Failed to create diary entry:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // This is considered an "anti-pattern" for tailwind but tailwind is probably overkill for this project anyways
  const inputClasses =
    'border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300';

  return (
    <div className="mb-6 border p-4 rounded shadow-sm bg-gray-50">
      {errorMessage && (
        <div className="mb-2 text-red-600 font-medium bg-red-100 rounded px-3 py-2 border border-red-300">
          {errorMessage}
        </div>
      )}
      <form onSubmit={submitDiaryEntry} className="flex flex-col gap-3">
        <input
          className={inputClasses}
          type="date"
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
        />

        <div className="flex gap-4">
          Weather:
          {weatherOptions.map((option) => (
            <span>
              <input
                type="radio"
                id={option}
                name="weatherButton"
                onChange={() => setNewWeather(option as Weather)}
                checked={newWeather === option}
                className="mr-1"
              />
              <label htmlFor={option}>{option}</label>
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          Visibility:
          {visibilityOptions.map((option) => (
            <span>
              <input
                type="radio"
                id={option}
                name="visibilityButton"
                onChange={() => setNewVisibility(option as Visibility)}
                checked={newVisibility === option}
                className="mr-1"
              />
              <label htmlFor={option}>{option}</label>
            </span>
          ))}
        </div>

        <input
          className={inputClasses}
          placeholder="Comment"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>
    </div>
  );
};
export default NewDiaryEntryForm;
