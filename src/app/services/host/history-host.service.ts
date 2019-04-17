import { Injectable } from '@angular/core';

/**
 * Service keeping track of the history of the game, i.e
 * the played tracks, how many games been played a.s.o
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class HistoryHostService {

  private tracks: SAPI.PlaylistTrackObject[];
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

  /**
   * Resets the amount of rounds played
   */
  resetRounds() {
    this.games = 0;
  }

  /**
   * Resets the whole game, emptying the history
   */
  resetGame() {
    this.tracks = [];
    this.categories = [];
    this.pickers = [];
    this.introduced = false;
    this.games = 0;
  }

  /**
   * Returns the played tracks
   * @returns An list of the played tracks during the game
   */
  get playedTracks(): SAPI.PlaylistTrackObject[] {
    return this.tracks;
  }

  /**
   * Adds a track to the history
   * @param track The track to add
   */
  addTrack(track: SAPI.PlaylistTrackObject) {
    this.tracks.push(track);
  }

  /**
   * Validates the track by checking if the track has been played before
   * @param id The id of the track to check
   * @returns `true` if the track has not been played already
   */
  validateTrack(id: string): boolean {
    return !this.tracks.some(t => t.track.id === id);
  }

  /**
   * Adds an category to the history
   * @param id The id of the category
   */
  addCategory(id: string) {
    this.categories.push(id);
  }

  /**
   * Validates if the category has been selected earlier
   * @param id The id of the category
   * @returns `true` if the category is ok
   */
  validateCategory(id: string) {
    return !this.categories.some(t => t === id);
  }

  /**
   * Adds a player uid to the list of pickers.
   * Makes sure every user get's to pick a category at most one time
   * @param id The uid of the player
   */
  addPicker(id: string) {
    this.pickers.push(id);
  }

  /**
   * Checks if a given player have picked a category before
   * @param id The uid of the player to check
   */
  validatePicker(id: string) {
    return !this.pickers.some(t => t === id);
  }

  /**
   * Adds a game to the game counter
   */
  addGame() {
    this.games += 1;
  }

  /**
   * Checks if the game is finshed, i.e been more than or 2 rounds
   * @returns `true`  if the game has finished
   */
  get finished(): boolean {
    return this.games >= 2;
  }
}
