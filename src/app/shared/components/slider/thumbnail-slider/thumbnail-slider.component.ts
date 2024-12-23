import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  input,
  effect,
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

  videoData: Video[] = [];

  // size = window.innerWidth;
  size = 0;
  offsetPosition = 0;
  offsetGap = 12;

  slider: SliderControl = {
    allowLeft: false,
    allowRight: false,
    position: 0,
    width: 0,
    minPosition: 0,
  };

  constructor() {
    this.videoData = [...this.videoService.videoData];

    effect(() => {
      let parentSize = this.parentSize();
      if (parentSize) this.size = parentSize;
    });
  }

  ngAfterViewInit() {
    console.log('size', this.size);

    let element = this.container?.nativeElement.getBoundingClientRect();
    console.log("container",element.width)
    let thumb = this.thumbnail?.nativeElement.getBoundingClientRect();
    this.offsetPosition = thumb.width;
    console.log(this.offsetPosition);

    this.slider.width = element.width;
    this.slider.minPosition = element.x;

    setTimeout(() => {
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition >= this.size) {
        this.slider.allowRight = true;
      }
    }, 1000);
  }

  ngAfterContentInit() {}

  slideRight() {
    // this.slider.position += -250;
    this.slider.position += -(this.offsetPosition + this.offsetGap);
    setTimeout(() => {
      if (this.container?.nativeElement.getBoundingClientRect().x <= 0) {
        this.slider.allowLeft = true;
      }
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition <= this.size) {
        this.slider.allowRight = false;
      }
    }, 1000);
  }

  getPositionOfLastChild(children: any) {
    let last = children.item(children.length - 1);
    return last.getBoundingClientRect().right;
  }

  slideLeft() {
    this.slider.position += this.offsetPosition + this.offsetGap;
    setTimeout(() => {
      if (this.container?.nativeElement.getBoundingClientRect().x >= 0) {
        this.slider.allowLeft = false;
      }
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition >= this.size) {
        this.slider.allowRight = true;
      }
    }, 1000);
  }

  selectVideo(index: number) {
    this.videoService.selectedVideo$.next(index);
  }
}
