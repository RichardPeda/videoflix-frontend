import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface password {
  type: string;
  show: boolean;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

resetPasswordForm = new FormGroup({
    password_0: new FormControl('', Validators.required),
    password_1: new FormControl('', Validators.required),
  });

  passwords: password[] = [
    { type: 'password', show: false },
    { type: 'password', show: false },
  ];

  togglePasswordVisible(index: number) {
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
    if (this.resetPasswordForm.valid) {
      let pw_0 = this.resetPasswordForm.get('password_0')?.value;
      let pw_1 = this.resetPasswordForm.get('password_1')?.value;
     

      if (pw_0 && pw_1) {
        let password = this.checkIfPasswordsmatch(pw_0!, pw_1!);
        if (password) {
          // this.loginService
          //   .postRegisterUser(username, email, pw_0, pw_1)
          //   .subscribe({
          //     next: (resp: any) => {
          //       if (resp.message == 'verification email was sent') {
          //         this.emailWasSent = true;
          //       }
          //     },
          //     error: (err) => {
          //       this.openMessage();
          //     },
          //   });
        }
      }
    }
  }
  checkIfPasswordsmatch(password_0: string, password_1: string): string | null {
    return password_0 === password_1 ? password_1 : null;
  }
}
