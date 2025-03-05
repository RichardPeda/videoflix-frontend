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
import { Router } from '@angular/router';
import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
})
export class StartPageComponent {
  private loginService = inject(LoginService);
  private networkService = inject(NetworkService)
  private router = inject(Router);
  profileForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  

  onSubmit() {
    if (this.profileForm.valid) {
      let email = this.profileForm.get('email');
      if (email && email.value) {
        this.loginService.postLoginOrSignUp(email.value).subscribe({
          next: (data: any) => {
            if (data.message) {
              if (data.message == 'user does not exist') {
                this.router.navigateByUrl('signup');
              } else if (data.message == 'user exists' && data.email) {
                console.log(typeof(data.email));
                
                this.loginService.setSessionStorage('email', data.email)

                this.router.navigateByUrl('login');
              }
            }
          },

          error: (err) => console.log('fehler', err),
        });
      }
    }
    else this.router.navigateByUrl('signup');
  }
}
