import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { Video } from '../../../core/models/video';
import { PlayButtonComponent } from '../../../shared/components/buttons/play-button/play-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teaser',
  standalone: true,
  imports: [CommonModule, PlayButtonComponent],
  templateUrl: './teaser.component.html',
  styleUrl: './teaser.component.scss',
})
export class TeaserComponent {
  @ViewChild('video') videoContainer!: ElementRef<HTMLVideoElement>;

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
          this.fadeOut(video, videoSrc);
        }
      }
    });
  }

  fadeOut(video: Video, videoSrc: string) {
    this.fadeActive = true;
    setTimeout(() => {
      this.currentVideo = video;
      this.currentVideoSrc = videoSrc;
    }, 1500);
    setTimeout(() => {
      this.fadeActive = false;
    }, 3000);
  }
}
