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
import { SpeedSelectionComponent } from '../speed-selection/speed-selection.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    CommonModule,
    HeaderPlayerComponent,
    VolumeBarComponent,
    SpeedSelectionComponent,
    FormsModule,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('speedControl') speedControl!: ElementRef;

  duration = signal(0);
  currentTime = signal(0);
   isVideoPlay = false;
  volume = signal(80);
  originalVolume = this.volume();
  videoMuted = computed(() => this.volume() == 0);

  timeRemaining = computed(() => this.duration() - this.currentTime());
 
  timeView = computed(
    () => this.timeFormat(this.timeRemaining())
  );


 
  timebar = 80;

  playSpeed = [1.0, 1.5, 2.0];
  selectedSpeed = this.playSpeed[0];

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
    this.duration.set(video.duration);
    // this.duration.set(2*3600 + 15*60);
    this.currentTime.set(video.currentTime);
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
    this.timebar = Math.floor(
      (100 / this.videoPlayer.nativeElement.duration) *
        this.videoPlayer.nativeElement.currentTime
    );
    this.currentTime.set(this.videoPlayer.nativeElement.currentTime);
  }

  changeSpeed(speed: number) {
    this.videoPlayer.nativeElement.playbackRate = speed;
  }

  changeTime(number: Event) {
    let currentTime = (this.timebar / 100) * this.duration();
    this.videoPlayer.nativeElement.currentTime = currentTime;
  }

  timeFormat(duration:number):string {
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor(((duration % 3600) / 60));
    const secs = Math.floor(duration % 60);
  
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
      if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }

}
