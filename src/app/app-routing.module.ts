import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { PlaybackComponent } from './playback/playback.component';
import { PlayerDisplayComponent } from './player/player-display/player-display.component';
import { WelcomeComponent } from './host/welcome/welcome.component';
import { HostGuard } from './core/host.guard';
import { HostDisplayComponent } from './host/host-display/host-display.component';
import { GameCreationComponent } from './host/game-creation/game-creation.component';
import { QuickJoinComponent } from './core/quick-join/quick-join.component';

const routes: Routes = [
  { path: 'display', component: HostDisplayComponent, canActivate: [HostGuard] },
  { path: 'playback', component: PlaybackComponent, canActivate: [HostGuard] },
  { path: 'game', component: PlayerDisplayComponent },
  { path: 'create-game', component: GameCreationComponent, canActivate: [HostGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [HostGuard] },
  { path: '', component: LoginComponent },
  { path: 'join', component: QuickJoinComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
