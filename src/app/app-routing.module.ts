import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlaybackComponent } from './playback/playback.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/callback', component: LoginComponent },
  { path: 'playback', component: PlaybackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
