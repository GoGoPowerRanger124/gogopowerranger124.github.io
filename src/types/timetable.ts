export interface TimetableEntry {
  id: string;
  subject: string;
  hour: number; // 0-23
  minute: number; // 0-59 (stored internally)
  endHour: number;
  endMinute: number;
  homework?: string;
  color: 'math' | 'english' | 'science' | 'history' | 'default';
}

export interface TimetableData {
  entries: TimetableEntry[];
  lastUpdated: string;
}

export const SUBJECT_COLORS: Record<string, TimetableEntry['color']> = {
  math: 'math',
  mathematics: 'math',
  english: 'english',
  language: 'english',
  science: 'science',
  biology: 'science',
  chemistry: 'science',
  physics: 'science',
  history: 'history',
  social: 'history',
};

export const getSubjectColor = (subject: string): TimetableEntry['color'] => {
  const lowerSubject = subject.toLowerCase();
  for (const [key, color] of Object.entries(SUBJECT_COLORS)) {
    if (lowerSubject.includes(key)) {
      return color;
    }
  }
  return 'default';
};

export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour} ${period}`;
};
