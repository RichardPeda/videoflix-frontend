import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient)
  private BASE_URL = environment.apiUrl;

  constructor() { }


  loginOrSignUp(email:string){
    let body = {'email': email}
    return this.http.post(`${this.BASE_URL}api/login-signup/`, {'email': email})

  }

}
