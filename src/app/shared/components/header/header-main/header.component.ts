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

  ngOnInit() {
    if (this.router.url === '/login') {
      this.hideLoginButton = true;
    }
    let login = this.loginService.getLocalStorage('loginSuccess');
    if (login && login === 'true') this.isUserLoggedIn = true;
    else this.isUserLoggedIn = false
  }

  logoutUser() {
    this.loginService.deleteLocalStorage('loginSuccess')
    this.loginService.deleteLocalStorage('email')
    this.loginService.deleteLocalStorage('password')
    this.loginService.deleteLocalStorage('remember')
    this.loginService.deleteLocalStorage('token')
    this.router.navigateByUrl('')
  }

  navToLogin() {
    this.router.navigateByUrl('login');
  }
}
