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
    email: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.emailForm.valid) {
      let email = this.emailForm.get('email')?.value;
      if (email) {
        this.loginService.postPasswordResetInquiry(email).subscribe({
          next: (resp: any) => {
            if (resp.status === 200) {
              this.emailSent = true;
              console.log('email was send');
            }
          },
          error: (err) => console.log(err),
        });
      }
    }
  }
}
