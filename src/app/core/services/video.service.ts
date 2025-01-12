import { inject, Injectable } from '@angular/core';
import { Video } from '../models/video';
import { BehaviorSubject, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  videoData: Video[] = [
    {
      id: 1,
      title: 'Breakout',
      description:
        'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
      thumbImageURL: '../../../../assets/images/thumbnail_9-min.jpg',
      videoURL: '../../../../assets/videos/escape.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 2,
      title: 'Majestic Whales',
      description: 'Wale Wale',
      thumbImageURL: '../../../../assets/images/thumbnail_2-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 3,
      title: 'Beispiel Titel 1',
      description: 'Beispiel Beschreibung 1',
      thumbImageURL: '../../../../assets/images/thumbnail_3-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 4,
      title: 'Beispiel Titel 2',
      description: 'Beispiel Beschreibung 2',
      thumbImageURL: '../../../../assets/images/thumbnail_4-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 5,
      title: 'Beispiel Titel 3',
      description: 'Beispiel Beschreibung 3',
      thumbImageURL: '../../../../assets/images/thumbnail_5-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 6,
      title: 'Beispiel Titel 4',
      description: 'Beispiel Beschreibung 4',
      thumbImageURL: '../../../../assets/images/thumbnail_6-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 7,
      title: 'Beispiel Titel 5',
      description: 'Beispiel Beschreibung 5',
      thumbImageURL: '../../../../assets/images/thumbnail_7-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
    {
      id: 8,
      title: 'Beispiel Titel 6',
      description: 'Beispiel Beschreibung 6',
      thumbImageURL: '../../../../assets/images/thumbnail_8-min.jpg',
      videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
      genre: 'Action',
      duration: 20,
    },
  ];

  private cachedVideos: Video[] | null = null;

  selectedVideo$ = new BehaviorSubject<number>(0);

  private http = inject(HttpClient);

  private BASE_URL = environment.apiUrl;

  constructor() {}

  getMovies() {
    if (this.cachedVideos) {
      return of(this.cachedVideos);
    } else {
      return this.http.get<any>(`${this.BASE_URL}api/movies/`).pipe(
        tap((data) => (this.cachedVideos = data)) // Daten cachen
      );
    }
  }
}
