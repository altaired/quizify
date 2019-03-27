export type GameMode = 'STANDARD';
export type GameState = 'WELCOME' | 'PICK_CATEGORY' | 'ANSWER' | 'RESULT' | 'END' | 'LOADING' | 'INTRO';

export interface CategoryOption {
  id: string;
  name: string;
  image: Image;
}

export interface Image {
  height: string;
  width: string;
  url: string;
}

export interface CategoryState {
  playerUID: string;
  playerResponse?: string;
  done: boolean;
  options: CategoryOption[];
}

export interface QuestionState {
  id: string;
  first: OptionQuestion;
  secondEnabled: boolean;
  second: string;
}

export interface OptionQuestion {
  title: string;
  options: Option[];
}

export interface Option {
  id: string;
  value: string;
}

export interface PlayerDisplay {
  category: CategoryState;
  question: QuestionState;
}

export interface Admin {
  playerUID: string;
  ready: boolean;
}

export interface Response {
  done: boolean;
  question: string;
  first: string;
  second: string;
}

export interface Player {
  uid: string;
  displayName: string;
  score?: number;
  response?: Response;
  avatar?: string;
}

export interface Game {
  gameMode: GameMode;
  state: GameState;
  playerDisplay?: PlayerDisplay;
  admin?: Admin;
  players?: Player[];
}
