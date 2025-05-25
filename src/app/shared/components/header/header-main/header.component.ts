import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../../core/services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private loginService = inject(LoginService);
  hideLoginButton = false;

  isUserLoggedIn = true;

  /**
   * Lifecycle hook that is called after component initialization.
   *
   * This method checks the current route to determine whether the login button
   * should be hidden. It also retrieves the user's
   * login state from local storage and sets the `isUserLoggedIn` flag accordingly.
   */
  ngOnInit() {
    if (this.router.url === '/login') {
      this.hideLoginButton = true;
    }
    let login = this.loginService.getLocalStorage('loginSuccess');
    if (login && login === 'true') this.isUserLoggedIn = true;
    else this.isUserLoggedIn = false;
  }

  /**
   * Logs out the current user by clearing authentication-related data from local storage
   * and navigating back to the home or login page.
   *
   * This method removes stored items such as login status, email, password, remember flag,
   * and token, then redirects the user to the root route.
   */
  logoutUser() {
    this.loginService.deleteLocalStorage('loginSuccess');
    this.loginService.deleteLocalStorage('email');
    this.loginService.deleteLocalStorage('password');
    this.loginService.deleteLocalStorage('remember');
    this.loginService.deleteLocalStorage('token');
    this.router.navigateByUrl('');
  }

  /**
   * Navigates to the login page.
   *
   * Uses Angular's Router to programmatically navigate to the `/login` route.
   */
  navToLogin() {
    this.router.navigateByUrl('login');
  }
}
