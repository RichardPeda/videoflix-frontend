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

@Component({
  selector: 'app-teaser',
  standalone: true,
  imports: [CommonModule, PlayButtonComponent],
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

        this.videostars = this.getStars(video.ranking);
      }
    });
  }

  changeSourceNow(video: Video, videoSrc: string) {
    this.currentVideo = video;
    this.currentVideoSrc = videoSrc;
  }

  fadeOut(video: Video, videoSrc: string) {
    this.fadeActive = true;
    setTimeout(() => {
      this.changeSourceNow(video, videoSrc);
    }, 1500);
    setTimeout(() => {
      this.fadeActive = false;
    }, 3000);
  }

  videostars: ('full' | 'half' | 'empty')[] = [];

  getStars(ranking: number) {
    const stars: ('full' | 'half' | 'empty')[] = [];

    const fullCount = Math.floor(ranking);
    const hasHalf = ranking % 1 >= 0.25 && ranking % 1 < 0.75;
    const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);

    for (let i = 0; i < fullCount; i++) stars.push('full');
    if (hasHalf) stars.push('half');
    for (let i = 0; i < emptyCount; i++) stars.push('empty');

    return stars;
  }
}
