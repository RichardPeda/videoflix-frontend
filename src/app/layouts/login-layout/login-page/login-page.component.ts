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
import { MessageToastComponent } from '../../../shared/components/message/message-toast/message-toast.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    MessageToastComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  router = inject(Router);
  private loginService = inject(LoginService);

  userEmail = '';
  messageText = 'Verification successful';
  messageType: 'good' | 'bad' = 'good';
  showError = false;
  initialState = true;

  ngOnInit() {
    let login = this.loginService.getLocalStorage('loginSuccess');
    if (login) this.router.navigateByUrl('overview');

    let rem = this.loginService.getLocalStorage('remember');
    if (rem && rem == 'true') {
      let remember = true;
      let email = this.loginService.getLocalStorage('email');
      let password = this.loginService.getLocalStorage('password');
      if (email && password) {
        this.loginForm.setValue({
          email: email,
          password: password,
          remember: remember,
        });
      } else this.loginService.deleteLocalStorage('remember');
    }

    if (this.loginService.verificationSuccess) {
      this.openMessage('Verification successful, you can login now', 'good');
      setTimeout(() => {
        this.closeMessage();
        this.loginService.verificationSuccess = false;
      }, 2000);
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'),
    ]),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
  });

  passwordType = 'password';
  isPasswordShown = false;

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisible() {
    this.isPasswordShown = !this.isPasswordShown;
    this.passwordType = this.togglePasswordType(this.isPasswordShown);
  }

  /**
   * Set the type of the password field to normal text or asterix
   * @param show a boolean to show or hide the password
   * @returns
   */
  togglePasswordType(show: boolean) {
    if (show) return 'text';
    else return 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let email = this.loginForm.get('email')?.value;
      let password = this.loginForm.get('password')?.value;
      if (email && password) {
        this.loginService.postLoginUser(email, password).subscribe({
          next: (resp: any) => {
            this.loginService.setLocalStorage('token', resp.token);
            this.loginService.setLocalStorage('loginSuccess', 'true');
            if (this.loginForm.value.remember) {
              this.loginService.setLocalStorage('remember', 'true');
              this.loginService.setLocalStorage('email', resp.email);
              this.loginService.setLocalStorage('password', password);
            }
            this.router.navigateByUrl('overview');
          },
          error: (err) => {
            if (err.status === 401) {
              this.openMessage(
                'The combination of email and password was not found.',
                'bad'
              );
              setTimeout(() => {
                this.closeMessage();
              }, 5000);
            }
          },
        });
      }
    }
  }

  /**
   * Open the floating message with a given text and type.
   * "good" message turns green. "bad" message turns red as an error.
   * @param text text for the message
   * @param type type of the message
   */
  openMessage(text: string, type: 'good' | 'bad') {
    this.messageType = type;
    this.showError = true;
    this.initialState = false;
    this.messageText = text;
  }

  /**
   * Close the floating message
   */
  closeMessage() {
    this.showError = false;
  }

  /**
   * If the remember checkbox is checked, save to local storage.
   * If the checkbox is not checked, delete password and email from local storage
   */
  setRemember() {
    let rem = this.loginForm.value.remember;
    if (rem && rem == true)
      this.loginService.setLocalStorage('remember', 'true');
    else {
      this.loginService.deleteLocalStorage('remember');
      this.loginService.deleteLocalStorage('password');
      this.loginService.deleteLocalStorage('email');
    }
  }
}
