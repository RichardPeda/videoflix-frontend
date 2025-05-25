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
import { PlayButtonComponent } from '../../buttons/play-button/play-button.component';
import { StarsRankingComponent } from '../../ranking/stars-ranking/stars-ranking.component';

interface SliderControl {
  allowRight: boolean;
  allowLeft: boolean;
  width: number;
  position: number;
  minPosition: number;
}

interface VideoStars {
  id: number;
  stars: ('full' | 'half' | 'empty')[];
}

@Component({
  selector: 'app-thumbnail-slider',
  standalone: true,
  imports: [CommonModule, StarsRankingComponent],
  templateUrl: './thumbnail-slider.component.html',
  styleUrl: './thumbnail-slider.component.scss',
})
export class ThumbnailSliderComponent {
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChild('thumbnail') thumbnail: ElementRef | undefined;
  public videoService = inject(VideoService);

  parentSize = input<number | undefined>();
  genre = input<string>();
  videos = input<Video[] | undefined>(undefined);

  windowWidth = window.innerWidth;

  size = 0;
  singeImageSize = 0;
  contentWidth = 0;
  offsetGap = 12;
  counter = 0;
  numberOfImages = 0;
  selected: number | undefined = undefined;

  sliderX = 0;
  sliderWidth = 0;
  sliderXabs = 0;

  videoStars: VideoStars[] = [];

  slider: SliderControl = {
    allowLeft: false,
    allowRight: false,
    position: 0,
    width: 0,
    minPosition: 0,
  };

  /**
   * Initializes the component and sets up reactive effects for size and video list changes.
   *
   * The constructor creates two reactive effects:
   * 1. Watches for changes in the parent container size and updates the component size accordingly.
   * 2. Watches for changes in the list of videos and recalculates:
   *    - The number of images (videos) available.
   *    - The size of a single thumbnail image.
   *    - The total width of the slider content.
   *    - The absolute slider position on the X-axis.
   *
   * @param {ElementRef} element - Reference to the host DOM element of the component.
   */
  constructor(@Self() private element: ElementRef) {
    effect(() => {
      let parentSize = this.parentSize();
      if (parentSize) {
        this.size = parentSize;
      }
    });
    effect(() => {
      let videos = this.videos();
      if (videos != undefined && videos.length > 0) {
        this.numberOfImages = videos.length;
        let thumb = this.thumbnail?.nativeElement.getBoundingClientRect();
        this.singeImageSize = thumb.width;
        this.sliderWidth =
          this.singeImageSize * this.numberOfImages +
          (this.numberOfImages - 1) * this.offsetGap;

        this.sliderXabs = this.sliderX + this.sliderWidth;
      }
    });
  }

  /**
   * Lifecycle hook called after Angular has fully initialized the component's view.
   *
   * This method:
   * - Retrieves the left (X) position of the slider container element.
   * - Sets the initial sliderX property based on the container's position.
   * - After a 500ms delay, checks and updates whether sliding to the right is allowed.
   */
  ngAfterViewInit() {
    let element = this.container?.nativeElement.getBoundingClientRect();
    this.sliderX = element.x;

    setTimeout(() => {
      this.slider.allowRight = this.isItAllowedToMoveRight();
    }, 500);
  }

  /**
   * Host listener that reacts to window resize events.
   *
   * Updates the current window width and recalculates whether sliding right
   * is allowed based on the new window size.
   *
   * @param {Event} event - The resize event object
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.slider.allowRight = this.isItAllowedToMoveRight();
  }

  /**
   * Determines whether sliding to the right is allowed based on current window width and slider position.
   *
   * Compares the window width with the absolute slider position to decide
   * if the slider can move further to the right.
   *
   * @returns {boolean} `true` if sliding right is allowed, otherwise `false`
   */
  isItAllowedToMoveRight(): boolean {
    return this.windowWidth <= this.sliderXabs ? true : false;
  }

  /**
   * Slides the slider to the right by updating its position and state.
   *
   * Calculates the offset to move the slider by one image width plus the gap,
   * updates the slider's current position and absolute position,
   * increments the slide counter, and updates the allowed sliding directions.
   *
   * After the slide animation (1 second), it enables sliding to the left if applicable.
   */
  slideRight() {
    let moveOffset = -(this.singeImageSize + this.offsetGap);
    this.slider.position += moveOffset;
    this.sliderXabs += moveOffset;
    this.counter += 1;
    this.slider.allowRight = this.isItAllowedToMoveRight();

    setTimeout(() => {
      if (this.counter > 0) this.slider.allowLeft = true;
    }, 1000);
  }

  /**
   * Slides the slider to the left by updating its position and state.
   *
   * Calculates the offset to move the slider by one image width plus the gap,
   * updates the slider's current position and absolute position,
   * decrements the slide counter, and updates the allowed sliding directions accordingly.
   *
   * After the slide animation (1 second), it updates whether sliding to the right is allowed.
   */
  slideLeft() {
    let moveOffset = this.singeImageSize + this.offsetGap;
    this.slider.position += moveOffset;
    this.sliderXabs += moveOffset;
    this.counter -= 1;

    if (this.counter > 0) this.slider.allowLeft = true;
    else this.slider.allowLeft = false;

    setTimeout(() => {
      this.slider.allowRight = this.isItAllowedToMoveRight();
    }, 1000);
  }

  /**
   * Selects a video by its index and updates related states.
   *
   * Sets the selected video ID signal in the video service,
   * updates the local selected index,
   * and triggers the mobile video slide state.
   *
   * @param {number} index - The index of the video to select.
   */
  selectVideo(index: number) {
    this.videoService.selectedVideoIdSignal.set(index);
    this.selected = index;
    this.videoService.slideMobileVideo.set(true);
  }

  /**
   * Converts a duration in seconds to a human-readable string format.
   *
   * If the duration is less than 60 seconds, it returns the seconds followed by 's'.
   * Otherwise, it returns a string formatted as 'X min Y s'.
   *
   * @param {number} duration - Duration in seconds.
   * @returns {string} The formatted duration string.
   */
  getDuration(duration: number) {
    if (duration < 60) return duration.toFixed(0) + ' s';
    else {
      const min = Math.floor(duration / 60);
      const sec = duration - min * 60;
      return min.toFixed(0) + ' min ' + sec.toFixed(0) + ' s';
    }
  }
}
