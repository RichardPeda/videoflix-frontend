import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  router = inject(Router);
  private loginService = inject(LoginService);

  userEmail = '';

  ngOnInit() {
    let sessionData = this.loginService.getSessionStorage('email');
    console.log(sessionData);

    if (sessionData != null) {
      this.userEmail = sessionData;
      this.initForm();
    }
  }

  initForm() {
    this.loginForm.setValue({
      email: this.userEmail,
      password: null,
      remember: null
    })
  }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
  });

  passwordType = 'password';
  isPasswordShown = false;

  togglePasswordVisible() {
    this.isPasswordShown = !this.isPasswordShown;
    this.passwordType = this.togglePasswordType(this.isPasswordShown);
  }

  togglePasswordType(show: boolean) {
    if (show) return 'text';
    else return 'password';
  }

  onSubmit() {
    console.log(this.loginForm.value.remember);
  }
}
