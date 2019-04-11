import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {
  MatIconModule,
  MatProgressBarModule,
  MatButtonModule,
  MatRippleModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatListModule,
  MatGridListModule,
  MatButtonToggleModule,
  MatStepperModule,
  MatSliderModule,
  MatSnackBarModule
} from '@angular/material';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { LoginComponent } from './core/login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './host/welcome/welcome.component';
import { HostDisplayComponent } from './host/host-display/host-display.component';
import { PlayerDisplayComponent } from './player/player-display/player-display.component';
import { GameCreationComponent } from './host/game-creation/game-creation.component';
import { JoinDialogComponent } from './player/join-dialog/join-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DrawAvatarComponent } from './player/ready/draw-avatar/draw-avatar.component';
import { CategoryListComponent } from './host/category-list/category-list.component';
import { GuessComponent } from './player/guess/guess.component';
import { ReadyComponent } from './player/ready/ready.component';
import { PlayerCardComponent } from './host/player-card/player-card.component';
import { QuickJoinComponent } from './core/quick-join/quick-join.component';
import { QRCodeModule } from 'angularx-qrcode';
import { OptionsComponent } from './player/options/options.component';
import { IntroComponent } from './host/intro/intro.component';
import { ResultsComponent } from './host/results/results.component';
import { GameHostService } from './services/host/game-host.service';
import { StateHostService } from './services/host/state-host.service';
import { WelcomeHostService } from './services/host/welcome-host.service';
import { CategoryHostService } from './services/host/category-host.service';
import { HistoryHostService } from './services/host/history-host.service';
import { AnswerComponent } from './host/answer/answer.component';
import { EndScreenComponent } from './host/end-screen/end-screen.component';
import {CdkDropList} from '@angular/cdk/drag-drop';
import { ErrorService } from './services/error.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlaybackComponent,
    WelcomeComponent,
    HostDisplayComponent,
    PlayerDisplayComponent,
    GameCreationComponent,
    JoinDialogComponent,
    DrawAvatarComponent,
    CategoryListComponent,
    GuessComponent,
    ReadyComponent,
    PlayerCardComponent,
    QuickJoinComponent,
    OptionsComponent,
    IntroComponent,
    ResultsComponent,
    AnswerComponent,
    EndScreenComponent,
    CdkDropList,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase, 'quizify-client'),
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    MatStepperModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatSliderModule,
    MatButtonToggleModule,
    QRCodeModule,
    
  ],
  providers: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    GameHostService,
    StateHostService,
    HistoryHostService,
    ErrorService
  ],
  bootstrap: [AppComponent],
  entryComponents: [JoinDialogComponent],
  exports: [ReactiveFormsModule, MatFormFieldModule]
})
export class AppModule { }
