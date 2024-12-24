import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';

interface password {
  type:string,
  show:boolean
}


@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password_0: new FormControl('', Validators.required),
    password_1: new FormControl('', Validators.required),
  });

  passwords:password[] = [
    {type: 'password', show: false},
    {type: 'password', show: false},
  ]
 
  showPasswordMatchWarning = false

  togglePasswordVisible(index:number) {
    console.log(index)
    this.passwords[index].show = !this.passwords[index].show
    this.passwords[index].type = this.togglePasswordType(this.passwords[index].show);
  }

  togglePasswordType(show: boolean) {
    if (show) return 'text';
    else return 'password';
  }

  onSubmit() {

    console.log("password 0", this.loginForm.value.password_0)
    console.log("password 1", this.loginForm.value.password_1)
   
  }
}
