import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;
  userEmail = '';
  verificationSuccess = false;
  verificationError = false;

  /**
   * Send user data to backend endpoint, to register a new user.
   * @param username username
   * @param email user email
   * @param password user password
   * @param repeated_password user repeated password
   * @returns Oberservable
   */
  postRegisterUser(
    username: string,
    email: string,
    password: string,
    repeated_password: string
  ): Observable<any> {
    const body = {
      username: username,
      email: email,
      password: password,
      repeated_password: repeated_password,
    };
    return this.http.post(`${this.BASE_URL}api/register/`, body);
  }

  /**
   * Send user data to backend endpoint, to login a registered user.
   * @param email user email
   * @param password user password
   * @returns Oberservable
   */
  postLoginUser(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.BASE_URL}api/login/`, body);
  }

  /**
   * Send user data to backend endpoint, to check if the user is already registered or a new user.
   * @param email user email
   * @returns Oberservable
   */
  postLoginOrSignUp(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post(`${this.BASE_URL}api/login-signup/`, {
      email: email,
    });
  }

  /**
   * Save data to the session storage.
   * @param key key word for storage
   * @param data data string which should be stored
   */
  setSessionStorage(key: string, data: string) {
    sessionStorage.setItem(key, data);
  }

  /**
   * Retrieve data from session storage
   * @param key key word for storage
   * @returns stored data string
   */
  getSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key.toString());
  }

  /**
   * Save data to the local storage.
   * @param key key word for storage
   * @param data data string which should be stored
   */
  setLocalStorage(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  /**
   * Retrieve data from local storage
   * @param key key word for storage
   * @returns stored data string
   */
  getLocalStorage(key: string): string | null {
    return localStorage.getItem(key.toString());
  }

  /**
   * Delete item in local storage
   * @param key key word for storage
   */
  deleteLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Send verification code and user id to backend endpoint, to verify the user after an verification email was sent.
   * @param user_id user id
   * @param code verification code
   * @returns Observable
   */
  postVerifyEmail(user_id: string, code: string): Observable<any> {
    const body = {
      user_id: user_id,
      code: code,
    };
    return this.http.post(`${this.BASE_URL}api/verification/`, body);
  }

  /**
   * Send user email to backend endpoint for a password reset inquiry
   * @param email user email
   * @returns Observable
   */
  postPasswordResetInquiry(email: string): Observable<any> {
    const body = {
      email: email,
    };
    return this.http.post(`${this.BASE_URL}api/password-reset-inquiry/`, body, {
      observe: 'response',
    });
  }

  /**
   * Send new user password with verification code to backend endpoint, to reset and set new password.
   * @param user_id user id
   * @param code verification code
   * @param password new password
   * @param repeated_password new password (repeated)
   * @returns Observable
   */
  postPasswordResetCommand(
    user_id: string,
    code: string,
    password: string,
    repeated_password: string
  ): Observable<any> {
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
