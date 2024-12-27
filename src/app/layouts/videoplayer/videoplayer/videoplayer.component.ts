import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { HeaderPlayerComponent } from '../../../shared/components/header/header-player/header-player/header-player.component';
import { VolumeBarComponent } from '../volume-bar/volume-bar.component';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, HeaderPlayerComponent, VolumeBarComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  duration = 0;
  currentTime = 0;
  percentage = 0;
  isVideoPlay = false;
  volume = signal(80);
  originalVolume = this.volume();
  videoMuted = computed(() => this.volume() == 0);

  constructor() {
    effect(() => {
      this.videoPlayer.nativeElement.volume = this.volume() / 100;
    });
  }

  playPauseVideo() {
    if (
      this.videoPlayer.nativeElement.paused ||
      this.videoPlayer.nativeElement.ended
    ) {
      this.videoPlayer.nativeElement.play();
      this.isVideoPlay = true;
    } else {
      this.videoPlayer.nativeElement.pause();
      this.isVideoPlay = false;
    }
  }

  onMetadata(e: any, video: { duration: number; currentTime: any }) {
    this.duration = video.duration;
    this.currentTime = video.currentTime;
    this.updateProgressBar();
  }

  replayVideo() {
    this.videoPlayer.nativeElement.currentTime -= 5;
  }
  forwardVideo() {
    this.videoPlayer.nativeElement.currentTime += 5;
  }

  toggleMute(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    /**
     * Save the volume before video is muted.
     * Set the saved volume when muting is off.
     */
    if (this.volume() > 0) {
      this.originalVolume = this.volume();
      this.volume.set(0);
    } else {
      this.volume.set(this.originalVolume);
    }
  }

  updateProgressBar() {
    /**
     * Work out how much of the media has played via the duration and currentTime parameters
     * Update the progress bar's value
     */
    this.percentage = Math.floor(
      (100 / this.videoPlayer.nativeElement.duration) *
        this.videoPlayer.nativeElement.currentTime
    );
  }
}
