export interface DevAccessQuestion {
  prompt: string;
  acceptedAnswers: string[];
}

export const DEV_ACCESS_QUESTIONS: DevAccessQuestion[] = [
  { prompt: 'What is my favorite color?', acceptedAnswers: ['turquoise'] },
  { prompt: 'What... is the air-speed velocity of an unladen swallow?', acceptedAnswers: ['African or European'] },
  { prompt: 'What is the answer to life, the universe, and everything?', acceptedAnswers: ['42'] }
];
