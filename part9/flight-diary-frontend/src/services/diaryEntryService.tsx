import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaryEntries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const createDiaryEntry = async (object: NewDiaryEntry) => {
  const response = await axios.post<NewDiaryEntry>(baseUrl, object);
  return response.data as DiaryEntry;
};
