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
import {
  ConvertableVideo,
  Video,
  VideoProgress,
} from '../../../core/models/video';
import { VideoService } from '../../../core/services/video.service';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { Genre } from '../../../core/models/genre';
import { LoginService } from '../../../core/services/login.service';
import { ThumbnailMobileComponent } from "../../../shared/components/slider/thumbnail-mobile/thumbnail-mobile.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ThumbnailSliderComponent,
    TeaserComponent,
    ThumbnailMobileComponent
],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  private elementRef = inject(ElementRef);
  public videoService = inject(VideoService);
  private loginService = inject(LoginService);

  contentSize = 0;
  screenWidth = 0;
  isScreenMobile = false;

  videoData: Video[] = [];
  videoForTeaser: Video | undefined;
  teaserVideoSrc: string = '';

  videoIndex = 0;

  genres: 'SEEN' | 'NEW' | 'DOKUMENTARY' | 'ACTION' | 'ROMANTIC' | 'DRAMA' =
    'DOKUMENTARY';

  genreTitles = [
    'Resume',
    'New on Videoflix',
    'Dokumentary',
    'Action',
    'Romantic',
    'Drama',
  ];

  videoArray: Video[][] = [];
  convertVideoArray: ConvertableVideo[] = [];

  seenVideos: Video[] = [];
  newVideos: Video[] = [];
  documantaryVideos: Video[] = [];
  actionVideos: Video[] = [];
  romanticVideos: Video[] = [];
  dramaVideos: Video[] = [];
  VideosInProgress: VideoProgress[] = [];
  mobileVideoChange = false;

  constructor(@Self() private element: ElementRef) {
    this.screenWidth = window.innerWidth;
    this.isScreenMobile = this.checkIfSreenMobile(window.innerWidth);
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
    this.loadProgress();
    // this.loadVideos();
  }

  checkIfSreenMobile(size: number) {
    console.warn(size)
    if (size < 555) return true;
    else return false;
  }

  loadProgress() {
    this.videoService.getMoviesProgress().subscribe({
      next: (progress: any) => {
        if (progress) {
          this.VideosInProgress = progress;
        }
      },
      complete: () => this.loadVideos(),
    });
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
    this.screenWidth = window.innerWidth;
    this.isScreenMobile = this.checkIfSreenMobile(window.innerWidth);
    this.videoService.isScreenMobile = this.checkIfSreenMobile(window.innerWidth)
  }

  sortVideosForGenre() {
    let genre = Genre;

    this.videoData.forEach((video) => {
      let videoAllreadyPlayed = this.VideosInProgress.find(
        (process) => process.movie == video.id
      );

      if (videoAllreadyPlayed) this.seenVideos.push(video);
      else if (video.genre == 'NEW') {
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

    this.videoArray[genre.seen] = [...this.seenVideos];
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
        teaser = firstDimension[0];
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
          this.videoForTeaser = this.videoData.find(
            (video) => video.id == findId
          );
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
