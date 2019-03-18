import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import { GuessArtistComponent } from './guess-artist/guess-artist.component';
import { GameboardComponent } from './player/gameboard/gameboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HostGuard } from './core/host.guard';
import { DisplayComponent } from './display/display.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'display', component: DisplayComponent, canActivate: [HostGuard] },
  { path: 'playback', component: PlaybackComponent, canActivate: [HostGuard] },
  { path: 'game', component: GameboardComponent },
  { path: '', component: WelcomeComponent, canActivate: [HostGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
