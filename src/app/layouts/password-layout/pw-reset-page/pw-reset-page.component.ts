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
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-pw-reset-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './pw-reset-page.component.html',
  styleUrl: './pw-reset-page.component.scss',
})
export class PwResetPageComponent {
  private loginService = inject(LoginService);
  emailSent = false;

  emailForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'),
    ]),
  });

  onSubmit() {
    if (this.emailForm.valid) {
      let email = this.emailForm.get('email')?.value;
      if (email) {
        this.loginService.postPasswordResetInquiry(email).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this.emailSent = true;
            }
          },
          error: (err) => console.log(err),
        });
      }
    }
  }
}
