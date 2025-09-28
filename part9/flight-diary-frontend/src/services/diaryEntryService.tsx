import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaryEntries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const createDiaryEntry = async (object: NewDiaryEntry) => {
  try {
    const response = await axios.post<NewDiaryEntry>(baseUrl, object);
    return response.data as DiaryEntry;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      // Fallback for other Axios errors
      throw new Error('An error occurred while creating the diary entry.');
    } else {
      // Fallback for mysteries
      console.error(error);
      throw new Error('An unknown error occurred.');
    }
  }
};
