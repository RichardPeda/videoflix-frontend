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
import { HeaderPlayerMobileComponent } from '../../../shared/components/header/header-player-mobile/header-player-mobile.component';

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
    HeaderPlayerMobileComponent,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('speedControl') speedControl!: ElementRef;

  private videoService = inject(VideoService);
  private loginService = inject(LoginService);

  videoName = '';
  videoFullData: Video[] = [];
  video: ConvertableVideo | undefined = undefined;
  videoData: ConvertableVideo[] = [];
  videoSrc = '';
  isLoading = true;
  messageText = 'You already played this video. Resume playing?';
  timestamp: number = 0;

  duration = signal(0);
  currentTime = signal(0);
  isVideoPlay = signal(false);
  volume = signal(10);
  originalVolume = this.volume();
  videoMuted = computed(() => this.volume() == 0);
  timeRemaining = computed(() => {
    let time = this.duration() - this.currentTime();
    if (time > 0) return time;
    else return 0;
  });

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

  isMobile = false;

  constructor() {
    if (window.innerWidth < 550) this.isMobile = true;
    else this.isMobile = false;

    this.timestamp = Date.now();
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 550) this.isMobile = true;
    else this.isMobile = false;
  }

  ngOnInit() {
    let id = this.loginService.getSessionStorage('videoID');
    if (id) {
      this.videoService.getSingleMovieProgress(Number(id)).subscribe({
        next: (data: any) => {
          if (data) {
            this.videoProgress.id = data.id;
            this.videoProgress.time = data.time;
            this.progressFound.set(true);
          }
        },
      });
      this.videoService.getMovies().subscribe({
        next: (data: any) => {
          if (data) {
            this.videoFullData = data;
            this.videoFullData.forEach((element) => {
              if (element.id == Number(id)) {
                this.videoName = element.title;
              }
            });
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
      let quality = this.selectedQuality();

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
      let time = this.videoPlayer.nativeElement.currentTime;
      this.isVideoPlay.set(false);
      if (this.video) this.saveTimeInAPI(this.video?.id, time);
    }
  }

  onMetadata(e: any, video: { duration: number; currentTime: any }) {
    this.duration.set(video.duration);
    this.currentTime.set(video.currentTime);
    this.updateProgressBar();
    let lastBufferedEnd = 0;
  }

  replayVideo() {
    this.videoPlayer.nativeElement.currentTime -= this.timeChangeValue;
    if (this.video) this.saveTimeInAPI(this.video?.id, this.timeChangeValue);
  }
  forwardVideo() {
    this.videoPlayer.nativeElement.currentTime += this.timeChangeValue;
    if (this.video) this.saveTimeInAPI(this.video?.id, this.timeChangeValue);
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

  timeStorage: number | undefined = undefined;

  updateProgressTime() {
    const duration = this.videoPlayer.nativeElement.duration;
    const currentVideoTime = this.videoPlayer.nativeElement.currentTime;
    const actTime = Date.now();

    if (this.timeStorage === undefined) this.timeStorage = currentVideoTime;

    if (this.video?.id) {
      if (currentVideoTime == duration) {
        this.timeStorage = 0;
        this.saveTimeInAPI(this.video.id, this.timeStorage);
      } else if (this.timestamp + 5000 < actTime) {
        this.timeStorage = currentVideoTime;
        this.saveTimeInAPI(this.video.id, this.timeStorage);
      }
    }
  }

  saveTimeInAPI(id: number, time: number) {
    this.videoService.postSingleMovieProgress(id, time).subscribe();
    this.timestamp = Date.now();
  }

  // changeSpeed(speed: number) {
  //   this.videoPlayer.nativeElement.playbackRate = speed;
  // }

  changeTime(number: Event) {
    /**
     * Set the currentTime of the videoplayer and save in API
     */
    let currentTime = (this.timebar / 100) * this.duration();
    this.videoPlayer.nativeElement.currentTime = currentTime;
    if (this.video) this.saveTimeInAPI(this.video?.id, currentTime);
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

    if (secs > 0) {
      return ret;
    } else return '0:00';
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
    this.isVideoPlay.set(true);
    this.closeMessage();
  }
}
