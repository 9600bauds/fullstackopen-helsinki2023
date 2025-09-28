export const weatherOptions = [
  'sunny',
  'rainy',
  'cloudy',
  'stormy',
  'windy',
] as const;
export type Weather = (typeof weatherOptions)[number];

export const visibilityOptions = ['great', 'good', 'ok', 'poor'] as const;
export type Visibility = (typeof visibilityOptions)[number];

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
