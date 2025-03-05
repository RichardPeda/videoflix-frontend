import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;
  userEmail = '';
  verificationSuccess = false;
  verificationError = false;
  // networkSpeed:number|undefined = undefined

  

  constructor() {
   
  }

  postRegisterUser(
    username: string,
    email: string,
    password: string,
    repeated_password: string
  ) {
    const body = {
      username: username,
      email: email,
      password: password,
      repeated_password: repeated_password,
    };
    return this.http.post(`${this.BASE_URL}api/register/`, body);
  }

  postLoginUser(email: string, password: string) {
    const body = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.BASE_URL}api/login/`, body);
  }

  postLoginOrSignUp(email: string) {
    const body = { email: email };
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

  deleteLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  postVerifyEmail(user_id: string, code: string) {
    const body = {
      user_id: user_id,
      code: code,
    };

    return this.http.post(`${this.BASE_URL}api/verification/`, body);
  }

  postPasswordResetInquiry(email: string) {
    /**
     * Send user email to backend for a passwort reset inquiry
     */
    const body = {
      email: email,
    };
    return this.http.post(`${this.BASE_URL}api/password-reset-inquiry/`, body, {
      observe: 'response',
    });
  }

  postPasswordResetCommand(
    user_id: string,
    code: string,
    password: string,
    repeated_password: string
  ) {
    /**
     * Send new user password for reset
     */
    const body = {
      user_id: user_id,
      code: code,
      password: password,
      repeated_password: repeated_password,
    };
    return this.http.post(`${this.BASE_URL}api/password-reset/`, body, {
      observe: 'response',
    });
  }

  
}

// < 0.5 Mbps	120p (sehr niedrig)	Nur für sehr langsames Internet (3G, 2G, schlechte Verbindungen)
// 0.5 - 2 Mbps	360p (SD)	Standard-Qualität für langsames 3G oder schlechte 4G-Netze
// 2 - 5 Mbps	720p (HD-Ready)	Gute Qualität für schnelles 3G / normales 4G
// > 5 Mbps	1080p (Full HD)	Sehr gute Qualität, ideal für 4G, 5G oder WLAN
// > 20 Mbps	1080p mit hoher Bitrate	Perfekte Qualität für schnelles WLAN oder Glasfaser
