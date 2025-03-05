import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;
  speedMbps = signal<number | undefined>(undefined);
  networkResolution: number | undefined = undefined;
  testFileUrl = signal<string | undefined>(undefined);

  constructor() {
    if (this.testFileUrl() == undefined) this.getTestfileURL();

    effect(() => {
      const testFile = this.testFileUrl();
      if (testFile) {
        this.testSpeed(testFile);
      }
    });

    effect(() => {
      const speed = this.speedMbps();
      console.log(speed);
      if (speed) {
        this.networkResolution = this.classifyNetwork(speed);
        sessionStorage.setItem('networkRes', this.networkResolution.toString())
      }
    });
  }

  getTestFile() {
    return this.http.get<any>(`${this.BASE_URL}api/connection/`);
  }

  getTestfileURL() {
    this.getTestFile().subscribe({
      next: async (resp: any) => {
        this.testFileUrl.set(resp.file);
      },
    });
  }
  async testSpeed(testFile: string) {
    let response = await fetch(testFile + '?nocache=' + new Date().getTime(), {
      method: 'GET',
    });

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
      console.log(`Berechnete Geschwindigkeit: ${speedMbps.toFixed(2)} Mbps`);
      this.speedMbps.set(speedMbps);
    }
  }

  classifyNetwork(speedMbps: number): number {
    if (speedMbps < 0.5) return 120;
    if (speedMbps < 2) return 360;
    if (speedMbps >= 2 && speedMbps < 5) return 720;
    if (speedMbps > 5) return 1080;
    return 0;
  }
}
