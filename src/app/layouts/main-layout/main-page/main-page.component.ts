import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  HostListener,
  Self,
} from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ThumbnailSliderComponent } from '../../../shared/components/slider/thumbnail-slider/thumbnail-slider.component';
import { ThumbnailPreviewComponent } from '../../../shared/components/slider/thumbnail-preview/thumbnail-preview.component';
import { TeaserComponent } from '../teaser/teaser.component';
import { Video } from '../../../core/models/video';
import { VideoService } from '../../../core/services/video.service';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { Genre } from '../../../core/models/genre';

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

  contentSize = 0;

  videoData: Video[] = [];

  videoIndex = 0;

  genres: 'NEW' | 'DOKUMENTARY' | 'ACTION' | 'ROMANTIC' | 'DRAMA' =
    'DOKUMENTARY';

  titles = ['New on Videoflix', 'Action', 'Dokumentary', 'Romantic', 'Drama'];

  videoArray: Video[][] = [];

  newVideos: Video[] = [];
  documantaryVideos: Video[] = [];
  actionVideos: Video[] = [];
  romanticVideos: Video[] = [];
  dramaVideos: Video[] = [];

  constructor(@Self() private element: ElementRef) {
    this.videoService.selectedVideo$.subscribe((selected) => {
      this.videoIndex = selected;
    });

    this.videoService.getMovies().subscribe({
      next: (data: any) => {
        console.log('data', data);
        this.videoData = data;
        this.sortVideosForGenre();
      },
      error: (err) => console.log(err),
    });
  }

  ngAfterContentInit() {
    this.contentSize = this.element.nativeElement.offsetWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
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
  }
}
