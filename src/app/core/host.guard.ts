import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HostGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  /**
   * Checks if the user is a host, i.e that the user is not anonymous
   * @param next The activated route
   * @param state The current route states
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user$.pipe(map(user => !user.isAnonymous));
  }
}
