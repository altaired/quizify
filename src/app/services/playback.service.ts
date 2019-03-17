import { Injectable } from '@angular/core';

/**
 * The Playback Service takes care of playing the music
 */

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  constructor() { }

  play(track: string) {

  }

  get devices() {
    return [];
  }

  setDevice(device: string) {

  }

  pause() {

  }

  setVolume(volume: number) {

  }

  get volume(): number {
    return 75;
  }


}
