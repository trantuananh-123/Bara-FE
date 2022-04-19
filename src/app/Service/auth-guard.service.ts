import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    public authService: AuthService,
    public router: Router,
    private toastrService: ToastrService
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn() && !this.authService.isExpired()) {
      this.router.navigate(['login']);
      this.toastrService.error('You need to login first!', 'Failed!');
      return false;
    } else if (!this.authService.isAuthenticated()) {
      this.router.navigate(['403']);
      return false;
    }
    return true;
  }
}
