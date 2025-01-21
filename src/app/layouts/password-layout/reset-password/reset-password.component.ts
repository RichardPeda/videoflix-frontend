import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';

interface password {
  type: string;
  show: boolean;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService)
  userId: string | null = '';
  code: string | null = '';
  dataValid = false
  resetSuccessfull = false


  resetPasswordForm = new FormGroup({
    password_0: new FormControl('', Validators.required),
    password_1: new FormControl('', Validators.required),
  });

  passwords: password[] = [
    { type: 'password', show: false },
    { type: 'password', show: false },
  ];

  constructor() {
    this.userId = this.route.snapshot.queryParamMap.get('user_id');
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.dataValid = this.userId && this.code ? true : false
  }

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
    if (this.resetPasswordForm.valid && this.dataValid) {
      let pw_0 = this.resetPasswordForm.get('password_0')?.value;
      let pw_1 = this.resetPasswordForm.get('password_1')?.value;

      if (pw_0 && pw_1) {
        let password = this.checkIfPasswordsmatch(pw_0!, pw_1!);
        if (password && this.userId && this.code) {
          this.loginService
            .postPasswordResetCommand(this.userId, this.code, pw_0, pw_1)
            .subscribe({
              next: (resp: any) => {
                if (resp.message == 'password reset successful') {
                  this.resetSuccessfull = true;
                }
              },
              error: (err) => {
                // this.openMessage();
                console.log(err);
                
              },
            });
        }
      }
    }
  }
  checkIfPasswordsmatch(password_0: string, password_1: string): string | null {
    return password_0 === password_1 ? password_1 : null;
  }
}
