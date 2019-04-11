import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryHostService {

  private tracks: any[];
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

  get playedTracks(){
    return this.tracks;
  }

  addTrack(track: any) {
    this.tracks.push(track);
  }

  validateTrack(id: string) {
    return !this.tracks.some(t => t.track.id === id);
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
    return this.games >= 2;
  }
}
