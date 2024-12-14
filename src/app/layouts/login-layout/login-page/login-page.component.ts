import { Component, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormControl,ReactiveFormsModule , Validator, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',

})
export class LoginPageComponent {
  profileForm = new FormGroup({
    email: new FormControl('', Validators.required),
   
  });

  onSubmit(){}
}
