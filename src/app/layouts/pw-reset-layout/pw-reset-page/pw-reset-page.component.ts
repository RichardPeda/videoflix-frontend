import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

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
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  onSubmit() {}
}
