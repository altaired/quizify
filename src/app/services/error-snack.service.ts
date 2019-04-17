import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
/**
 * Service that takes in and displays errors as a snackbar item
 * @author Simon Persson, Oskar Norinder
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorSnackService {

  constructor(
    private snackbar: MatSnackBar
  ){}
 /**
   * Takes in the error to be shown as a snackbar item
   * @param error The error to display
   * @param action The text for the button on the snackbar item standard is 'Close'
   * @param durration Standard 5000 the duration the snackbar error should be shown for in ms
   */
  onError(error, action = 'Close', duration = 5000){
  return this.snackbar.open(error, action, {duration});
  }
}
