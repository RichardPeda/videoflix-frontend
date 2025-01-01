import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { HeaderPlayerComponent } from '../../../shared/components/header/header-player/header-player/header-player.component';
import { VolumeBarComponent } from '../volume-bar/volume-bar.component';
import { SpeedSelectionComponent } from '../speed-selection/speed-selection.component';
import { FormsModule } from '@angular/forms';
import { Video } from '../../../core/models/video';
import { QualitySelectionComponent } from '../quality-selection/quality-selection.component';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    CommonModule,
    HeaderPlayerComponent,
    VolumeBarComponent,
    SpeedSelectionComponent,
    QualitySelectionComponent,
    FormsModule,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('speedControl') speedControl!: ElementRef;

  video: Video = {
    id: 1,
    title: 'Mighty Wales',
    description: 'See the wales',
    videoURL: '../../../../assets/videos/147535-791696855_small.mp4',
    thumbImageURL: '',
    duration: 20,
    genre: 'Action',
  };

  duration = signal(0);
  currentTime = signal(0);
  isVideoPlay = signal(false);
  volume = signal(10);
  originalVolume = this.volume();
  videoMuted = computed(() => this.volume() == 0);
  timeRemaining = computed(() => this.duration() - this.currentTime());
  timeView = computed(() => this.timeFormat(this.timeRemaining()));
  timebar = 0;
  timeChangeValue = 5;
  playSpeed = [2.0, 1.5, 1.0];
  selectedSpeed = signal(this.playSpeed[2]);

  qualities = [1080, 720, 360, 120];
  selectedQuality = signal(this.qualities[3]);

  fullScreen = false;

  fadoutControls = signal(false);

  timeout: number | undefined;

  constructor() {
    effect(() => {
      this.videoPlayer.nativeElement.volume = this.volume() / 100;
    });
    effect(() => {
      this.videoPlayer.nativeElement.playbackRate = this.selectedSpeed();
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: any) {
    window.clearTimeout(this.timeout);
    this.fadoutControls.set(false);
    this.timeout = window.setTimeout(() => {
      this.fadoutControls.set(true);
    }, 5000);
  }

  playPauseVideo() {
    if (
      this.videoPlayer.nativeElement.paused ||
      this.videoPlayer.nativeElement.ended
    ) {
      this.videoPlayer.nativeElement.play();
      this.isVideoPlay.set(true);
    } else {
      this.videoPlayer.nativeElement.pause();
      this.isVideoPlay.set(false);
    }
  }

  onMetadata(e: any, video: { duration: number; currentTime: any }) {
    this.duration.set(video.duration);
    this.currentTime.set(video.currentTime);
    this.updateProgressBar();
    this.videoPlayer.nativeElement.play();
  }

  replayVideo() {
    this.videoPlayer.nativeElement.currentTime -= this.timeChangeValue;
  }
  forwardVideo() {
    this.videoPlayer.nativeElement.currentTime += this.timeChangeValue;
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
    this.timebar = Math.floor(
      (100 / this.videoPlayer.nativeElement.duration) *
        this.videoPlayer.nativeElement.currentTime
    );
    this.currentTime.set(this.videoPlayer.nativeElement.currentTime);
  }

  // changeSpeed(speed: number) {
  //   this.videoPlayer.nativeElement.playbackRate = speed;
  // }

  changeTime(number: Event) {
    /**
     * Set the currentTime of the videoplayer
     */
    let currentTime = (this.timebar / 100) * this.duration();
    this.videoPlayer.nativeElement.currentTime = currentTime;
  }

  timeFormat(duration: number): string {
    /**
     * Formats the duration [s] in an output like "1:01" or "4:03:59" or "123:03:59"
     */
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = Math.floor(duration % 60);
    let ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
  }
}
