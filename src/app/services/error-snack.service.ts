import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorSnackService {

  constructor(
    private snackbar: MatSnackBar
  ){}

  onError(error, action = 'Close', duration = 5000){
  return this.snackbar.open(error, action, {duration});
  }
}
