import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor() {}

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
}
