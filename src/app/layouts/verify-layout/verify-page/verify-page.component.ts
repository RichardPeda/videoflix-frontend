import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginService } from '../../../core/services/login.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-verify-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './verify-page.component.html',
  styleUrl: './verify-page.component.scss',
})
export class VerifyPageComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userIsVerified = false;

  constructor() {
    let userId = this.route.snapshot.queryParamMap.get('user_id');
    let code = this.route.snapshot.queryParamMap.get('code');

    if (userId && code) {
      this.loginService.postVerifyEmail(userId, code).subscribe({
        next: (resp: any) => {
          if (resp.message === 'user verified') {
            delay(2000);
            this.loginService.verificationSuccess = true;
            this.router.navigateByUrl('login');
          }
        },
        error: (err) => {
          this.loginService.verificationError = true;
          this.router.navigateByUrl('signup');
        },
      });
    }
  }
}
