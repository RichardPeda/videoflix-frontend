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
    MessageToastComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  router = inject(Router);
  private loginService = inject(LoginService);

  userEmail = '';
  messageText = 'Verification successful'
  showError = false;
  initialState = true

  ngOnInit() {
    let sessionData = this.loginService.getSessionStorage('email');
    console.log(sessionData);

    if (sessionData != null) {
      this.userEmail = sessionData;
      this.initForm();
    }

    if(this.loginService.verificationSuccess){
      this.openMessage('Verification successful, you can login now')
      setTimeout(() => {
        this.closeMessage()
        this.loginService.verificationSuccess=false
      }, 2000);

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


  openMessage(text:string) {
    this.showError = true;
    this.initialState = false;
    this.messageText = text;
  }
  closeMessage() {
    this.showError = false;
  }
}
