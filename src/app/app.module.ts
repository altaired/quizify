import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { MatIconModule } from '@angular/material';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import { HttpClientModule } from '@angular/common/http';
import { GuessArtistComponent } from './guess-artist/guess-artist.component';
import { GuessTrackComponent } from './guess-track/guess-track.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DisplayComponent } from './display/display.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlaybackComponent,
    GuessArtistComponent,
    GuessTrackComponent,
    WelcomeComponent,
    DisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase, 'quizify-client'),
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [AngularFireModule, AngularFireAuthModule, AngularFireDatabaseModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
