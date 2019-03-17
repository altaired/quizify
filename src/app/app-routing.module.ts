import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import {GuessArtistComponent} from './guess-artist/guess-artist.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/callback', component: LoginComponent },
  { path: 'playback', component: PlaybackComponent },
  { path: 'guess-artist', component: GuessArtistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
