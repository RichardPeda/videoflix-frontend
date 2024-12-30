import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  input,
  effect,
  ViewContainerRef,
  HostListener,
  Self,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailPreviewComponent } from '../thumbnail-preview/thumbnail-preview.component';
import { Video } from '../../../../core/models/video';
import { VideoService } from '../../../../core/services/video.service';

interface SliderControl {
  allowRight: boolean;
  allowLeft: boolean;
  width: number;
  position: number;
  minPosition: number;
}

@Component({
  selector: 'app-thumbnail-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thumbnail-slider.component.html',
  styleUrl: './thumbnail-slider.component.scss',
})
export class ThumbnailSliderComponent {
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChild('thumbnail') thumbnail: ElementRef | undefined;
  private videoService = inject(VideoService);

  parentSize = input<number | undefined>();

  windowWidth = window.innerWidth;

  videoData: Video[] = [];
  size = 0;
  singeImageSize = 0;
  contentWidth = 0;
  offsetGap = 12;
  counter = 0;
  numberOfImages = 0;

  sliderX = 0;
  sliderWidth = 0;
  sliderXabs = 0;

  slider: SliderControl = {
    allowLeft: false,
    allowRight: false,
    position: 0,
    width: 0,
    minPosition: 0,
  };

  constructor(@Self() private element: ElementRef) {
    this.videoData = [...this.videoService.videoData];


    //TESTING
    // for (let index = 0; index < 6; index++) {
    //   const element = this.videoService.videoData[index];
    //   this.videoData.push(element);
    // }

    this.numberOfImages = this.videoData.length;

    effect(() => {
      let parentSize = this.parentSize();
      if (parentSize) this.size = parentSize;      
    });
  }

  ngAfterViewInit() {
    //get the left position of slider
    let element = this.container?.nativeElement.getBoundingClientRect();
    this.sliderX = element.x;

    //get single image
    let thumb = this.thumbnail?.nativeElement.getBoundingClientRect();
    this.singeImageSize = thumb.width;

    //content size of slider
    this.sliderWidth =
      this.singeImageSize * this.numberOfImages +
      (this.numberOfImages - 1) * this.offsetGap;

    this.sliderXabs = this.sliderX + this.sliderWidth; //absolute x position (right) of the slider element

    setTimeout(() => {
      this.slider.allowRight = this.isItAllowedToMoveRight();
    }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.slider.allowRight = this.isItAllowedToMoveRight();
  }

  isItAllowedToMoveRight() {
    return this.windowWidth <= this.sliderXabs ? true : false;
  }

  slideRight() {
    let moveOffset = -(this.singeImageSize + this.offsetGap);

    this.slider.position += moveOffset; //new slider position
    this.sliderXabs += moveOffset; //new slider abs position
    this.counter += 1;

    this.slider.allowRight = this.isItAllowedToMoveRight();

    //check after slide animation is finished
    setTimeout(() => {
      if (this.counter > 0) this.slider.allowLeft = true;
    }, 1000);
  }

  slideLeft() {
    let moveOffset = this.singeImageSize + this.offsetGap;
    this.slider.position += moveOffset; //new slider position
    this.sliderXabs += moveOffset; //new slider abs position
    this.counter -= 1;

    if (this.counter > 0) this.slider.allowLeft = true;
    else this.slider.allowLeft = false;

    //check after slide animation is finished
    setTimeout(() => {
      this.slider.allowRight = this.isItAllowedToMoveRight();
    }, 1000);
  }

  selectVideo(index: number) {
    this.videoService.selectedVideo$.next(index);
  }
}
