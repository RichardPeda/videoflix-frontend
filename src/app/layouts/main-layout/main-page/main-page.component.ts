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

  constructor(@Self() private element: ElementRef) {
    this.videoData = [...this.videoService.videoData];

    this.videoService.selectedVideo$.subscribe((selected) => {
      this.videoIndex = selected;
    });

    console.log(element);
  }

  ngAfterContentInit() {
    // console.log(this.element.nativeElement.offsetWidth)
    this.contentSize = this.element.nativeElement.offsetWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    
    this.contentSize =this.element.nativeElement.offsetWidth
    
  }
}
