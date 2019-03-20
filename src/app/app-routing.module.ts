import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import { GameboardComponent } from './player/gameboard/gameboard.component';
import { WelcomeComponent } from './host/welcome/welcome.component';
import { HostGuard } from './core/host.guard';
import { DisplayComponent } from './display/display.component';
import { GameCreationComponent } from './host/game-creation/game-creation.component';

const routes: Routes = [
  { path: 'display', component: DisplayComponent, canActivate: [HostGuard] },
  { path: 'playback', component: PlaybackComponent, canActivate: [HostGuard] },
  { path: 'game', component: GameboardComponent },
  { path: 'create-game', component: GameCreationComponent, canActivate: [HostGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [HostGuard] },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
