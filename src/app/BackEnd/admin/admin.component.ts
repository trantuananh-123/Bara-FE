import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  constructor(
    private lazyService: LazyLoadScriptService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/custom.min.js');
  }
  ngOnInit(): void {
    if (!this.isAdmin() || !this.loggedIn()) {
      this.router.navigate(['/home']);
      console.log('HELLO');
    }
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }
}
