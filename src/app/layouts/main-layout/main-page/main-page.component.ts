import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  HostListener,
  Self,
  effect,
} from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ThumbnailSliderComponent } from '../../../shared/components/slider/thumbnail-slider/thumbnail-slider.component';
import { ThumbnailPreviewComponent } from '../../../shared/components/slider/thumbnail-preview/thumbnail-preview.component';
import { TeaserComponent } from '../teaser/teaser.component';
import { ConvertableVideo, Video } from '../../../core/models/video';
import { VideoService } from '../../../core/services/video.service';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { Genre } from '../../../core/models/genre';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ThumbnailSliderComponent,
    TeaserComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  private elementRef = inject(ElementRef);
  private videoService = inject(VideoService);
  private loginService = inject(LoginService);

  contentSize = 0;

  videoData: Video[] = [];
  videoForTeaser: Video | undefined;
  teaserVideoSrc: string = '';

  videoIndex = 0;

  genres: 'NEW' | 'DOKUMENTARY' | 'ACTION' | 'ROMANTIC' | 'DRAMA' =
    'DOKUMENTARY';

  genreTitles = [
    'New on Videoflix',
    'Action',
    'Dokumentary',
    'Romantic',
    'Drama',
  ];

  videoArray: Video[][] = [];
  convertVideoArray: ConvertableVideo[] = [];

  newVideos: Video[] = [];
  documantaryVideos: Video[] = [];
  actionVideos: Video[] = [];
  romanticVideos: Video[] = [];
  dramaVideos: Video[] = [];

  constructor(@Self() private element: ElementRef) {
    console.log(window.innerWidth);
    this.videoService.setBestVideoSize(window.innerWidth);
    effect(
      () => {
        let selectedVideo = this.videoService.selectedVideoIdSignal();
        if (selectedVideo) {
          this.videoForTeaser = this.videoData.find(
            (video) => video.id == selectedVideo
          );
          this.getTeaser(selectedVideo);
        }
      },
      { allowSignalWrites: true }
    );

    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getMovies().subscribe({
      next: (data: any) => {
        this.videoData = data;
      },
      complete: () => {
        this.sortVideosForGenre();
        this.loadConvertableVideos();
      },
      error: (err) => console.log(err),
    });
  }

  loadConvertableVideos() {
    this.videoService.getConvertedMovies().subscribe({
      next: (data: any) => {
        this.convertVideoArray = data;

        const id = sessionStorage.getItem('videoID');
        if (id) this.getTeaser(+id);
        else this.getFirstTeaser();
      },
      error: (err) => console.log(err),
    });
  }

  ngAfterContentInit() {
    this.contentSize = this.element.nativeElement.offsetWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.videoService.setBestVideoSize(window.innerWidth);
    this.contentSize = this.element.nativeElement.offsetWidth;
  }

  sortVideosForGenre() {
    let genre = Genre;

    this.videoData.forEach((video) => {
      if (video.genre == 'NEW') {
        this.newVideos.push(video);
      } else if (video.genre == 'DOCUMENTARY') {
        this.documantaryVideos.push(video);
      } else if (video.genre == 'ACTION') {
        this.actionVideos.push(video);
      } else if (video.genre == 'ROMANTIC') {
        this.romanticVideos.push(video);
      } else if (video.genre == 'DRAMA') {
        this.dramaVideos.push(video);
      }
    });

    this.videoArray[genre.new] = [...this.newVideos];
    this.videoArray[genre.action] = [...this.actionVideos];
    this.videoArray[genre.documentary] = [...this.documantaryVideos];
    this.videoArray[genre.romantic] = [...this.romanticVideos];
    this.videoArray[genre.drama] = [...this.dramaVideos];

    this.videoForTeaser = this.findFirstVideo(this.videoArray);
  }

  findFirstVideo(multiArray: Video[][]) {
    let teaser;
    for (let index = 0; index < multiArray.length; index++) {
      const firstDimension = multiArray[index];
      if (firstDimension.length > 0) {
        for (let i = 0; index < firstDimension.length; index++) {
          const secondDimension = firstDimension[index];
          if (secondDimension) {
            teaser = secondDimension;
            break;
          }
        }
      }
    }
    return teaser;
  }

  getFirstTeaser() {
    if (this.videoForTeaser && this.convertVideoArray) {
      this.convertVideoArray.find((convert) => {
        if (convert.movie === this.videoForTeaser?.id) {
          this.teaserVideoSrc =
            this.videoService.getConvertableVideoForResolution(
              convert,
              this.videoService.recommendedResolution()
            );
          this.saveVideoID(this.videoForTeaser.id);
        }
      });
    }
  }

  getTeaser(findId: number) {
    if (this.convertVideoArray) {
      this.convertVideoArray.find((convert) => {
        if (convert.movie === findId) {
          this.teaserVideoSrc =
            this.videoService.getConvertableVideoForResolution(
              convert,
              this.videoService.recommendedResolution()
            );
          console.log(this.teaserVideoSrc);
          this.saveVideoID(findId);
        }
      });
    }
  }

  saveVideoID(id: number) {
    this.loginService.setSessionStorage('videoID', id.toString());
  }
}
