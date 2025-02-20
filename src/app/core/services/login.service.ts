import { effect, inject, Injectable, signal } from '@angular/core';
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
  speedMbps = signal<number | undefined>(undefined);
  networkSpeed = 0;

  constructor() {
    this.testSpeed();

    effect(() => {
      const speed = this.speedMbps();
      if (speed) {
        this.networkSpeed = this.classifyNetwork(speed);
        console.log(this.networkSpeed);
        
      }
    });
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

  measureNetworkSpeed() {
    return this.http.get<any>(`${this.BASE_URL}api/connection/`);
  }

  testFileUrl = '';

  testSpeed() {
    this.measureNetworkSpeed().subscribe({
      next: (resp: any) => {
        this.testFileUrl = resp.file;
      },
      complete: async () => {
        let response = await fetch(
          this.testFileUrl + '?nocache=' + new Date().getTime(),
          {
            method: 'GET',
          }
        );

        const reader = response.body?.getReader();
        if (!reader) {
          console.error('Reader konnte nicht erstellt werden!');
          this.speedMbps.set(5);
        } else {
          const contentLength = response.headers.get('content-length')
            ? parseInt(response.headers.get('content-length')!)
            : 102400;

          const fileSizeInBits = contentLength * 8;

          let received = 0;
          const startTime = new Date().getTime();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.length;
          }

          const endTime = new Date().getTime();
          const durationInSeconds = (endTime - startTime) / 1000;
          const speedMbps = fileSizeInBits / durationInSeconds / (1024 * 1024);
          console.log(
            `Berechnete Geschwindigkeit: ${speedMbps.toFixed(2)} Mbps`
          );
          this.speedMbps.set(speedMbps);
        }
      },
    });
  }

  classifyNetwork(speedMbps: number): number {
    if (speedMbps < 0.5) return 120
    if (speedMbps < 2) return 360
    if (speedMbps >2 && speedMbps < 5) return 720
    if (speedMbps > 5) return 1080
    return 0
  }
}

// < 0.5 Mbps	120p (sehr niedrig)	Nur für sehr langsames Internet (3G, 2G, schlechte Verbindungen)
// 0.5 - 2 Mbps	360p (SD)	Standard-Qualität für langsames 3G oder schlechte 4G-Netze
// 2 - 5 Mbps	720p (HD-Ready)	Gute Qualität für schnelles 3G / normales 4G
// > 5 Mbps	1080p (Full HD)	Sehr gute Qualität, ideal für 4G, 5G oder WLAN
// > 20 Mbps	1080p mit hoher Bitrate	Perfekte Qualität für schnelles WLAN oder Glasfaser