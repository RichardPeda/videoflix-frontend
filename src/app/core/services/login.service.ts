import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;
  userEmail = '';
  verificationSuccess = false
  verificationError = false

  

  postRegisterUser(
    username: string,
    email: string,
    password: string,
    repeated_password: string
  ) {
    let body = {
      username: username,
      email: email,
      password: password,
      repeated_password: repeated_password,
    };
    return this.http.post(`${this.BASE_URL}api/register/`, body);
  }

  postLoginUser(email:string, password:string){
    let body = {
      email:email,
      password:password
    }
    return this.http.post(`${this.BASE_URL}api/login/`, body);
  }

  postLoginOrSignUp(email: string) {
    let body = { email: email };
    return this.http.post(`${this.BASE_URL}api/login-signup/`, {
      email: email,
    });
  }

  setSessionStorage(key: string, data: string) {
    sessionStorage.setItem(key, data);
  }

  getSessionStorage(key: string) {
    return sessionStorage.getItem(key.toString());
  }

  setLocalStorage(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  getLocalStorage(key: string) {
    return localStorage.getItem(key.toString());
  }

  deleteLocalStorage(key:string){
    localStorage.removeItem(key)
  }

  postVerifyEmail(user_id: string, code: string) {
    let body = {
      user_id: user_id,
      code: code,
    };

    return this.http.post(`${this.BASE_URL}api/verification/`, body);
  }

  postPasswordResetInquiry(email: string) {
    /**
     * Send user email to backend for a passwort reset inquiry
     */
    let body = {
      email: email,
    };
    return this.http.post(`${this.BASE_URL}api/password-reset-inquiry/`, body, {observe:'response'});
  }

  postPasswordResetCommand(user_id: string, code: string, password:string, repeated_password:string) {
    /**
     * Send new user password for reset
     */
    let body = {
      user_id: user_id,
      code: code,
      password:password,
      repeated_password:repeated_password

    };
    return this.http.post(`${this.BASE_URL}api/password-reset/`, body, {observe:'response'});
  }
}
