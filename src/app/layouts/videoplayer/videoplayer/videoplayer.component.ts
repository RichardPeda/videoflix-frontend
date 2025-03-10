import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { HeaderPlayerComponent } from '../../../shared/components/header/header-player/header-player/header-player.component';
import { VolumeBarComponent } from '../volume-bar/volume-bar.component';
import { SpeedSelectionComponent } from '../speed-selection/speed-selection.component';
import { FormsModule } from '@angular/forms';
import { ConvertableVideo, Video } from '../../../core/models/video';
import { QualitySelectionComponent } from '../quality-selection/quality-selection.component';
import { VideoService } from '../../../core/services/video.service';
import { LoginService } from '../../../core/services/login.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageToastComponent } from '../../../shared/components/message/message-toast/message-toast.component';
import { ErrorToastComponent } from '../../../shared/components/message/error-toast/error-toast.component';

interface progress {
  time: number | undefined;
  id: number | undefined;
}

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
    MatProgressSpinnerModule,
    ErrorToastComponent,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('speedControl') speedControl!: ElementRef;

  private videoService = inject(VideoService);
  private loginService = inject(LoginService);

  video: ConvertableVideo | undefined = undefined;
  videoData: ConvertableVideo[] = [];
  videoSrc = '';
  isLoading = true;
  messageText = 'You already played this video. Resume playing?';

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
  // selectedQuality = signal(this.qualities[3]);
  selectedQuality = signal(this.videoService.recommendedResolution());

  progressFound = signal(false);
  videoProgress: progress = {
    id: undefined,
    time: undefined,
  };
  showError = false;
  initialState = true;
  fullScreen = false;
  switchVideo = false;

  fadoutControls = signal(false);

  timeout: number | undefined;

  constructor() {
    effect(() => {
      this.videoPlayer.nativeElement.volume = this.volume() / 100;
    });
    effect(() => {
      this.videoPlayer.nativeElement.playbackRate = this.selectedSpeed();
    });

    effect(() => {
      const videoElement = this.videoPlayer.nativeElement;
      const currentTime = videoElement.currentTime; // Speichere aktuelle Zeit
      const isPlaying = !videoElement.paused;

      const quality = this.selectedQuality();
      if (quality && this.video) {
        const preloadedVideo = document.createElement('video');
        preloadedVideo.src = this.videoService.getConvertableVideoForResolution(
          this.video!,
          quality
        );
        preloadedVideo.preload = 'auto';

        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.currentTime = currentTime; // Stelle vorherige Zeit wieder her

          if (isPlaying) videoElement.play(); // Falls es vorher spielte, weiter abspielen

          this.isLoading = false;
        });

        preloadedVideo.addEventListener('canplaythrough', () => {
          this.switchVideo = true;

          // Quelle umschalten, wenn Video geladen wurde
          this.videoSrc = preloadedVideo.src;
          this.videoPlayer.nativeElement.currentTime = currentTime;

          // console.log(time)
          setTimeout(() => {
            this.switchVideo = false;
          }, 100);
        });
      }
    });
    effect(() => {
      let foundProgress = this.progressFound();
      if (foundProgress) {
        this.openMessage('You already played this video. Resume playing?');
      }
    });
  }

  ngOnInit() {
    let id = this.loginService.getSessionStorage('videoID');
    if (id) {
      this.videoService.getMovieProgress(Number(id)).subscribe({
        next: (data: any) => {
          if (data) {
            this.videoProgress.id = data.id;
            this.videoProgress.time = data.time;
            this.progressFound.set(true);
          }
        },
      });
    }

    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getConvertedMovies().subscribe({
      next: (data: any) => {
        this.videoData = data;
      },
      complete: () => {
        this.video = this.findSelectedConvertableVideo();
        if (this.video) this.videoSrc = this.findQuality(this.video);
      },
      error: (err) => console.log(err),
    });
  }

  findSelectedConvertableVideo() {
    const sessionID = this.loginService.getSessionStorage('videoID');
    if (sessionID) {
      return this.videoData.find((video) => video.id == +sessionID);
    } else {
      console.warn('video not found');
      return undefined;
    }
  }

  findQuality(video: ConvertableVideo) {
    if (video) {
      // let quality = this.videoService.userSelectedResolution();
      let quality = this.selectedQuality();
      console.log('quality', quality);

      if (quality) {
        return this.videoService.getConvertableVideoForResolution(
          video,
          quality
        );
      } else {
        quality = this.videoService.recommendedResolution();
        if (quality) {
          return this.videoService.getConvertableVideoForResolution(
            video,
            quality
          );
        } else return '';
      }
    } else return '';
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
    // this.videoPlayer.nativeElement.play();
    console.log(this.videoPlayer.nativeElement.buffered.length);
    let lastBufferedEnd = 0;

    // this.videoPlayer.nativeElement.addEventListener('timeupdate', () => {
    //   const bufferedEnd = this.videoPlayer.nativeElement.buffered.end(
    //     this.videoPlayer.nativeElement.buffered.length - 1
    //   );
    //   const remainingBuffer = bufferedEnd - video.currentTime;
    //   const totalDuration = video.duration;
    //   const buffer = this.videoPlayer.nativeElement.buffered;

    //   // Berechnung des relativen Puffers: Wie viel Prozent des Videos ist geladen?
    //   const bufferedPercentage = (bufferedEnd / totalDuration) * 100;
    //   const bufferGrowth = bufferedEnd - lastBufferedEnd; // Wie schnell wächst der Buffer?

    //   console.log(`Buffered: ${bufferedPercentage.toFixed(2)}%`);
    //   console.log(`Buffer Growth: ${bufferGrowth.toFixed(2)}s`);
    //   console.log(`Remaining Buffer: ${remainingBuffer.toFixed(2)}s`);
    //   console.log(`Buffer : ${bufferedEnd}s`);
    //   lastBufferedEnd = bufferedEnd;
    // });

    // setTimeout(() => {
    //   this.videoSrc = this.video?.video_360p!
    // }, 5000);
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

  openMessage(text: string) {
    this.showError = true;
    this.initialState = false;
    this.messageText = text;
  }

  closeMessage() {
    this.showError = false;
  }

  resumePlaying() {
    this.videoPlayer.nativeElement.currentTime = this.videoProgress.time!;
    this.videoPlayer.nativeElement.play();
    this.closeMessage();
  }
}
