import { Component, OnInit } from '@angular/core';
import {
  AuthenticationService,
  UserType,
} from 'src/app/services/authentication.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}
  isLoggedIn = false;
  user!: UserType | null;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.authenticatedUser$.subscribe((user) => (this.user = user));
  }

  logout() {
    this.authService.logout();
  }
}
