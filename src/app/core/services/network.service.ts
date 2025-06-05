import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;
  speedMbps = signal<number | undefined>(undefined);
  networkResolution: number | undefined = undefined;
  testFileUrl = signal<string | undefined>(undefined);

  /**
   * If testfileUrl is undefined => get testfile and test the speed of the network.
   * If the speed is clarified, set the resolution what the files should have, depends on network speed.
   */
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
      if (speed) {
        this.networkResolution = this.classifyNetwork(speed);
        sessionStorage.setItem('networkRes', this.networkResolution.toString());
      }
    });
  }

  /**
   * GET request to backend endpoint to get a testfile for network connection test.
   * @returns Observable
   */
  getTestFile(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}api/connection/`);
  }

  /**
   * GET request to backend endpoint to receive a testfile, when exists, and save it to signal.
   */
  getTestfileURL() {
    this.getTestFile().subscribe({
      next: async (resp: any) => {
        if (resp) this.testFileUrl.set(resp.file);
      },
    });
  }

  /**
   * Fetch a testfile from backend. Save the time at start and end of download with a ReadableStream.
   * Calculate download rate
   * @param testFileUrl testfile url
   */
  async testSpeed(testFileUrl: string) {
    let response = await fetch(
      testFileUrl + '?nocache=' + new Date().getTime(),
      { method: 'GET' }
    );

    const reader = response.body?.getReader();
    if (!reader) {
      console.error('Reader could not be created!');
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
      this.countDuration(fileSizeInBits, startTime, endTime);
    }
  }

  /**
   * Calculate the duration for the download and the download speed and set to signal
   * @param fileSizeInBits file size in bits
   * @param startTime start time of download
   * @param endTime end time of download
   */
  countDuration(fileSizeInBits: number, startTime: number, endTime: number) {
    const durationInSeconds = (endTime - startTime) / 1000;
    const speedMbps = fileSizeInBits / durationInSeconds / (1024 * 1024);
    this.speedMbps.set(speedMbps);
  }

  /**
   * Depending on the download speed, different resolutions for the videos are set automatically.
   * The better the speed, the better the resolution.
   * @param speedMbps download speed in Mbit/s
   * @returns resolution (120p, 360p, 720p, 1080p)
   */
  classifyNetwork(speedMbps: number): number {
    if (speedMbps < 0.5) return 120;
    if (speedMbps < 2) return 360;
    if (speedMbps >= 2 && speedMbps < 5) return 720;
    if (speedMbps > 5) return 1080;
    return 0;
  }
}
