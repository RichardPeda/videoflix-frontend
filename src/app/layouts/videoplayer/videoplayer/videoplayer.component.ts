import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild, viewChild } from '@angular/core';
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
  volume = 30

  playPauseVideo() {
    console.log(this.videoPlayer.nativeElement.currentTime);
    console.log('duration', this.videoPlayer.nativeElement.duration);
    console.log(this.videoPlayer.nativeElement);

    if (
      this.videoPlayer.nativeElement.paused ||
      this.videoPlayer.nativeElement.ended
    ) {
      // Change the button to a pause button
      // this.changeButtonType(this.btnPlayPause, 'pause');
      this.videoPlayer.nativeElement.play();
      this.isVideoPlay = true;
    } else {
      // Change the button to a play button
      // this.changeButtonType(this.btnPlayPause, 'play');
      this.videoPlayer.nativeElement.pause();
      this.isVideoPlay = false;
    }
  }

  onMetadata(e: any, video: { duration: number; currentTime: any }) {
    console.log('metadata: ', e);
    console.log('duration: ', (this.duration = video.duration));
    console.log('currentTime: ', (this.currentTime = video.currentTime));
    this.updateProgressBar();
  }

  replayVideo() {
    this.videoPlayer.nativeElement.currentTime -= 5;
  }
  forwardVideo() {
    this.videoPlayer.nativeElement.currentTime += 5;
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

    // console.log("percentage", this.percentage);
  }
}
