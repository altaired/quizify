import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';
import { PlaybackComponent } from './playback/playback.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlaybackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase, 'quizify-client')
  ],
  providers: [AngularFireModule, AngularFireAuthModule, AngularFireDatabaseModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
