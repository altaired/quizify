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
  MatButtonToggleModule
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
import { GuessOptionComponent } from './player/guess-option/guess-option.component';
import { GuessTextComponent } from './player/guess-text/guess-text.component';
import { ReadyComponent } from './player/ready/ready.component';
import { CategoryPickComponent } from './player/category-pick/category-pick.component';
import { PlayerCardComponent } from './host/player-card/player-card.component';
import { QuickJoinComponent } from './core/quick-join/quick-join.component';
import { QRCodeModule } from 'angularx-qrcode';
import { IntroComponent } from './host/intro/intro.component';


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
    GuessOptionComponent,
    GuessTextComponent,
    ReadyComponent,
    CategoryPickComponent,
    PlayerCardComponent,
    QuickJoinComponent,
    IntroComponent,

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
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatButtonToggleModule,
    QRCodeModule,
  ],
  providers: [AngularFireModule, AngularFireAuthModule, AngularFireDatabaseModule],
  bootstrap: [AppComponent],
  entryComponents: [JoinDialogComponent],
  exports: [ReactiveFormsModule, MatFormFieldModule]
})
export class AppModule { }
