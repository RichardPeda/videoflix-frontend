import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ConvertableVideo, Video } from '../models/video';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private loginService = inject(LoginService);
  private networkService = inject(NetworkService);
  headers = new HttpHeaders();

  recommendedResolution = computed(() => {
    const networkRes = sessionStorage.getItem('networkRes');
    const videoSize = this.setBestVideoSize(window.innerWidth);
    if (videoSize && networkRes) return Math.min(videoSize, +networkRes);
    else return videoSize;
  });

  userSelectedResolution = signal<number | undefined>(undefined);

  /**
   * Set an general header for further requests with Authorization token
   */
  constructor() {
    this.headers = this.headers.append(
      'Authorization',
      'Token ' + this.loginService.getLocalStorage('token')
    );

    effect(() => {
      let slide = this.slideMobileVideo();
      if (slide == false) {
        setTimeout(() => {
          this.scrollToTop();
        }, 1000);
      }
    });
  }

  /**
   * scroll the window to the top
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  private cachedVideos: Video[] | null = null;
  private cachedConvertableVideos: ConvertableVideo[] | null = null;

  selectedVideoIdSignal = signal<number>(0);
  selectedVideoSignal = signal<Video | undefined>(undefined);
  slideMobileVideo = signal(false);
  isScreenMobile = false;

  videoResolution = {
    minimal: 120,
    low: 360,
    middle: 720,
    high: 1080,
  };

  threshold = {
    low: 240,
    middle: 540,
    high: 900,
  };

  private http = inject(HttpClient);

  private BASE_URL = environment.apiUrl;

  /**
   *
   * @param windowSize window width in pixels
   * @returns resolution (120p, 360p, 720p, 1080p) as number
   */
  setBestVideoSize(windowSize: number): number {
    if (windowSize <= this.threshold.low) return this.videoResolution.minimal;
    else {
      if (windowSize > this.threshold.high) return this.videoResolution.high;
      else if (windowSize > this.threshold.middle)
        return this.videoResolution.middle;
      else return this.videoResolution.low;
    }
  }

  /**
   * Retrieves the list of movies from the server or returns cached data if available.
   * If movie data has already been cached, it returns the cached data as an Observable.
   * Otherwise, it sends an HTTP GET request to the API and caches the result for future use.
   * @returns Observable, Array of type Video
   */
  getMovies(): Observable<Video[]> {
    if (this.cachedVideos) {
      return of(this.cachedVideos);
    } else {
      return this.http
        .get<Video[]>(`${this.BASE_URL}api/movies/`, {
          headers: this.headers,
        })
        .pipe(tap((data) => (this.cachedVideos = data)));
    }
  }

  /**
   * Retrieves the list of convertable movies from the server.
   * @returns Observable, Array of type ConvertableVideo
   */
  getConvertedMovies(): Observable<ConvertableVideo[]> {
    return this.http
      .get<ConvertableVideo[]>(`${this.BASE_URL}api/movies-convert/`, {
        headers: this.headers,
      })
      .pipe(tap((data) => (this.cachedConvertableVideos = data)));
  }

  /**
   * Retrieves a single convertable movie from the server.
   * @param id id of the video
   * @returns Observable
   */
  getSingleConvertedMovie(id: number): Observable<ConvertableVideo> {
    return this.http.get<ConvertableVideo>(
      `${this.BASE_URL}api/movie-convert/${id}`,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Returns the url as string for the given convertable video of the chosen resolution.
   * @param convertable convertable video
   * @param minRes minimum resolution
   * @returns a string of the url for the chosen resolution
   */
  getConvertableVideoForResolution(
    convertable: ConvertableVideo,
    minRes: number
  ): string {
    switch (minRes) {
      case 120:
        return convertable.video_120p;
        break;
      case 360:
        return convertable.video_360p;
        break;
      case 720:
        return convertable.video_720p;
        break;
      case 1080:
        return convertable.video_1080p;
      default:
        return convertable.video_120p;
        break;
    }
  }

  /**
   * Send a GET request to the endpoint and returns the progress of all videos.
   * @returns Observable
   */
  getMoviesProgress(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}api/movie-progress/`, {
      headers: this.headers,
    });
  }

  /**
   * Send a GET request to the endpoint and returns the progress of one video.
   * @param videoId id of the video
   * @returns Observable
   */
  getSingleMovieProgress(videoId: number): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}api/single-movie-progress/${videoId}`,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Send a POST request to the endpoint and set the new time of the progress of the specific video.
   * @param videoId id of the video
   * @param time current time of the video
   * @returns Observable
   */
  postSingleMovieProgress(videoId: number, time: number): Observable<any> {
    const body = {
      time: time,
    };
    return this.http.post<any>(
      `${this.BASE_URL}api/single-movie-progress/${videoId}`,
      body,
      {
        headers: this.headers,
      }
    );
  }
}
