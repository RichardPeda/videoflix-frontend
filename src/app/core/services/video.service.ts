import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ConvertableVideo, Video } from '../models/video';
import { of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
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
    const videoSize = this.setBestVideoSize(window.innerWidth)
    if (videoSize && networkRes) return Math.min(videoSize, +networkRes);
    else return videoSize;
  });

  userSelectedResolution = signal<number | undefined>(undefined);

  constructor() {
    this.headers = this.headers.append(
      'Authorization',
      'Token ' + this.loginService.getLocalStorage('token')
    );
  }

  videoData: Video[] = [
    {
      id: 1,
      title: 'Breakout',
      description:
        'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
      image_url: '../../../../assets/images/thumbnail_9-min.jpg',
      videoURL: '../../../../assets/videos/escape.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 2,
      title: 'Majestic Whales',
      description: 'Wale Wale',
      image_url: '../../../../assets/images/thumbnail_2-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 3,
      title: 'Beispiel Titel 1',
      description: 'Beispiel Beschreibung 1',
      image_url: '../../../../assets/images/thumbnail_3-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 4,
      title: 'Beispiel Titel 2',
      description: 'Beispiel Beschreibung 2',
      image_url: '../../../../assets/images/thumbnail_4-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 5,
      title: 'Beispiel Titel 3',
      description: 'Beispiel Beschreibung 3',
      image_url: '../../../../assets/images/thumbnail_5-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 6,
      title: 'Beispiel Titel 4',
      description: 'Beispiel Beschreibung 4',
      image_url: '../../../../assets/images/thumbnail_6-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 7,
      title: 'Beispiel Titel 5',
      description: 'Beispiel Beschreibung 5',
      image_url: '../../../../assets/images/thumbnail_7-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 8,
      title: 'Beispiel Titel 6',
      description: 'Beispiel Beschreibung 6',
      image_url: '../../../../assets/images/thumbnail_8-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
  ];

  private cachedVideos: Video[] | null = null;
  private cachedConvertableVideos: ConvertableVideo[] | null = null;

  selectedVideoIdSignal = signal<number>(0);
  selectedVideoSignal = signal<Video | undefined>(undefined);

  // videoSizeSetpoint = signal<number | undefined>(undefined);
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

  setBestVideoSize(windowSize: number) {
    if (windowSize <= this.threshold.low)
      return (this.videoResolution.minimal);
    else {
      if (windowSize > this.threshold.high)
        return (this.videoResolution.high);
      else if (windowSize > this.threshold.middle)
        return(this.videoResolution.middle);
      else return(this.videoResolution.low);
    }
  }

  getMovies() {
    if (this.cachedVideos) {
      return of(this.cachedVideos);
    } else {
      return this.http
        .get<any>(`${this.BASE_URL}api/movies/`, {
          headers: this.headers,
        })
        .pipe(
          tap((data) => (this.cachedVideos = data)) // Daten cachen
        );
    }
  }
  getConvertedMovies() {
    if (this.cachedConvertableVideos) {
      return of(this.cachedConvertableVideos);
    } else {
      return this.http
        .get<any>(`${this.BASE_URL}api/movies-convert/`, {
          headers: this.headers,
        })
        .pipe(
          tap((data) => (this.cachedConvertableVideos = data)) // Daten cachen
        );
    }
  }

  getSingleConvertedMovie(id: number) {
    return this.http.get<any>(`${this.BASE_URL}api/movie-convert/${id}`, {
      headers: this.headers,
    });
  }

  getConvertableVideoForResolution(
    convertable: ConvertableVideo,
    minRes: number
  ) {
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
}
