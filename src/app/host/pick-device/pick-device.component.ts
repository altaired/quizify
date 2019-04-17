import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaybackService } from 'src/app/services/playback.service';
import { Observable } from 'rxjs';

/**
 * Component that is a dialog that shows the hosts different spotify devices and allows them to change between them.
 * @author Simon Persson, Oskar Norinder
 */

@Component({
  selector: 'app-pick-device',
  templateUrl: './pick-device.component.html',
  styleUrls: ['./pick-device.component.scss']
})
export class PickDeviceComponent implements OnInit {

  devices$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<PickDeviceComponent>,
    private playback: PlaybackService

  ) { }

  ngOnInit() {
    this.devices$ = this.playback.devices;
  }
  close(): void {
    this.dialogRef.close();
  }

}
