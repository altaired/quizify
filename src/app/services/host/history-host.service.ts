import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryHostService {

  private tracks: string[];
  private categories: string[];
  private pickers: string[];
  introduced: boolean;
  private games: number;

  constructor() {
    this.tracks = [];
    this.categories = [];
    this.pickers = [];
    this.introduced = false;
    this.games = 0;
  }

  addTrack(id: string) {
    this.tracks.push(id);
  }

  validateTrack(id: string) {
    return !this.tracks.some(t => t === id);
  }

  addCategory(id: string) {
    this.categories.push(id);
  }

  validateCategory(id: string) {
    return !this.categories.some(t => t === id);
  }

  addPicker(id: string) {
    this.pickers.push(id);
  }

  validatePicker(id: string) {
    return !this.pickers.some(t => t === id);
  }

  addGame() {
    this.games += 1;
  }

  get finished(): boolean {
    return this.games >= 3;
  }
}
