import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { Video } from '../../../core/models/video';
import { PlayButtonComponent } from '../../../shared/components/buttons/play-button/play-button.component';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video.service';
import { StarsRankingComponent } from '../../../shared/components/ranking/stars-ranking/stars-ranking.component';

@Component({
  selector: 'app-teaser',
  standalone: true,
  imports: [CommonModule, PlayButtonComponent, StarsRankingComponent],
  templateUrl: './teaser.component.html',
  styleUrl: './teaser.component.scss',
})
export class TeaserComponent {
  @ViewChild('video') videoContainer!: ElementRef<HTMLVideoElement>;
  public videoService = inject(VideoService);

  ngAfterViewInit() {
    const video = this.videoContainer.nativeElement;
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (video.currentTime >= 10) {
          video.currentTime = 0;
        }
      });
    }
  }

  video = input<Video>();
  videoSrc = input<string>();
  currentVideo: Video | undefined;
  currentVideoSrc: string = '';

  newVideo: Video | undefined;
  newVideoSrc: string = '';
  fadeActive = false;

  /**
   * Initializes a reactive effect to manage video playback state and transitions.
   *
   * This constructor sets up an Angular Signal-based effect that reacts to changes
   * in the selected video and its source. Depending on the current screen width and
   * whether a video is already playing, it either:
   * - Sets the current video and source for the first time,
   * - Or transitions to a new video using `fadeOut()` or `changeSourceNow()`.
   *
   * The logic ensures smooth video switching behavior tailored for desktop and mobile screen sizes.
   */
  constructor() {
    effect(() => {
      let video = this.video();
      let videoSrc = this.videoSrc();
      if (video && videoSrc) {
        if (this.currentVideo == undefined) {
          this.currentVideo = video;
          this.currentVideoSrc = videoSrc;
          this.newVideo = video;
        } else {
          this.newVideo = video;
          this.newVideoSrc = videoSrc;
          if (window.innerWidth > 555) this.fadeOut(video, videoSrc);
          else this.changeSourceNow(video, videoSrc);
        }
      }
    });
  }

  /**
   * Immediately updates the current video and its source without any transition effect.
   *
   * This method is typically used for quick video source changes, e.g., on smaller screens
   * where a fade-out animation is not necessary or desired.
   *
   * @param {Video} video - The video object to be set as the current video
   * @param {string} videoSrc - The source URL of the selected video
   */
  changeSourceNow(video: Video, videoSrc: string) {
    this.currentVideo = video;
    this.currentVideoSrc = videoSrc;
  }

  /**
   * Triggers a fade-out effect before switching to a new video and source.
   *
   * This method sets a flag to activate a fade-out animation, waits 1.5 seconds,
   * switches the video source using `changeSourceNow()`, and then disables the
   * fade effect after 3 seconds total.
   *
   * @param {Video} video - The video object to switch to after the fade-out
   * @param {string} videoSrc - The source URL of the new video
   */
  fadeOut(video: Video, videoSrc: string) {
    this.fadeActive = true;
    setTimeout(() => {
      this.changeSourceNow(video, videoSrc);
    }, 1500);
    setTimeout(() => {
      this.fadeActive = false;
    }, 3000);
  }

  /**
   * Converts a video duration (in seconds) to a human-readable string.
   *
   * This method returns the duration formatted as:
   * - "X sec" if under 60 seconds
   * - "X min Y sec" if over 60 seconds and has remaining seconds
   * - "X min" if exactly divisible by 60
   *
   * @param {number} duration - The video duration in seconds
   * @returns {string} The formatted duration string
   */
  getDuration(duration: number) {
    const rounded = Math.floor(duration);
    if (rounded < 60) return rounded + ' sec';
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    if (seconds > 0) return minutes + ' min ' + seconds + ' sec';
    return minutes + ' min';
  }
}
