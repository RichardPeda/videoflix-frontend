import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { ErrorToastComponent } from '../../../shared/components/message/error-toast/error-toast.component';

interface password {
  type: string;
  show: boolean;
}

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    ErrorToastComponent,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

  emailWasSent = false;
  showError = false;
  initialState = true
  errorText = 'Please check your entries and try again';

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password_0: new FormControl('', Validators.required),
    password_1: new FormControl('', Validators.required),
  });

  passwords: password[] = [
    { type: 'password', show: false },
    { type: 'password', show: false },
  ];

  ngOnInit() {
    this.emailWasSent = false;
    this.showError = false;
  }

  togglePasswordVisible(index: number) {
    console.log(index);
    this.passwords[index].show = !this.passwords[index].show;
    this.passwords[index].type = this.togglePasswordType(
      this.passwords[index].show
    );
  }

  togglePasswordType(show: boolean) {
    if (show) return 'text';
    else return 'password';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let pw_0 = this.registerForm.get('password_0')?.value;
      let pw_1 = this.registerForm.get('password_1')?.value;
      let username = this.registerForm.get('username')?.value;
      let email = this.registerForm.get('email')?.value;

      if (pw_0 && pw_1 && username && email) {
        let password = this.checkIfPasswordsmatch(pw_0!, pw_1!);
        if (password) {
          this.loginService
            .postRegisterUser(username, email, pw_0, pw_1)
            .subscribe({
              next: (resp: any) => {
                if (resp.message == 'verification email was sent') {
                  this.emailWasSent = true;
                }
              },
              error: (err) => {
                this.openMessage();
              },
            });
        }
      }
    }
  }

  openMessage() {
    this.showError = true;
    this.initialState = false
    this.errorText = 'Please check your entries and try again';
  }
  closeMessage() {
    this.showError = false;
  }

  checkIfPasswordsmatch(password_0: string, password_1: string): string | null {
    return password_0 === password_1 ? password_1 : null;
  }
}
