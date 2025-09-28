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
  const submitDiaryEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd: NewDiaryEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment,
    };
    try {
      createDiaryEntry(entryToAdd).then((data) => {
        addNewEntry(data);
        resetForm();
      });
    } catch (error) {
      console.error('Failed to create diary entry:', error);
    }

    console.log(entryToAdd);
    //setNotes(notes.concat(noteToAdd));
  };

  return (
    <div>
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
