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
import { HeaderPlayerMobileComponent } from '../../../shared/components/header/header-player-mobile/header-player-mobile.component';
import { MessageToastInteractiveComponent } from '../../../shared/components/message/error-toast/message-toast-interactive.component';

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
    MessageToastInteractiveComponent,
    HeaderPlayerMobileComponent,
    MessageToastComponent,
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
  selectedQuality = signal(this.videoService.recommendedResolution());

  progressFound = signal(false);
  videoProgress: progress = {
    id: undefined,
    time: undefined,
  };
  showFirstMessage = false;
  showSecondMessage = false;
  initialStateFirstMessage = true;
  initialStateSecondMessage = true;
  isSecondMessage = false;

  fullScreen = false;
  switchVideo = false;
  fadoutControls = signal(false);
  timeout: number | undefined;
  isMobile = false;

  /**
   * Initializes the video player component with responsive settings, reactive effects, and video preloading.
   *
   * - Detects if the current device is mobile based on window width.
   * - Sets a timestamp for tracking purposes.
   * - Creates reactive effects to:
   *   - Adjust the video volume based on the current volume signal.
   *   - Adjust the playback speed based on the selected speed signal.
   *   - Preload and switch video quality while preserving playback time and state.
   *   - Show a resume message if previous playback progress is found.
   */
  constructor() {
    if (window.innerWidth < 550) this.isMobile = true;
    else this.isMobile = false;
    this.timestamp = Date.now();

    this.setupVolumeEffect();
    this.setupPlaybackRateEffect();
    this.setupQualitySwitchEffect();
    this.setupProgressFoundEffect();

    setTimeout(() => {
      this.showcurrentResolutionMessage();
    }, 500);
  }

  /**
   * Sets up a reactive effect to update the video volume based on the current volume signal.
   */
  private setupVolumeEffect() {
    effect(() => {
      this.videoPlayer.nativeElement.volume = this.volume() / 100;
    });
  }

  /**
   * Sets up a reactive effect to preload a video with the selected quality,
   * preserve playback time, and switch the video source once the new video is ready.
   */
  private setupQualitySwitchEffect() {
    effect(() => {
      const videoElement = this.videoPlayer.nativeElement;
      const currentTime = videoElement.currentTime;
      const isPlaying = !videoElement.paused;

      const quality = this.selectedQuality();
      if (quality && this.video) {
        this.preloadVideoWithQuality(
          quality,
          currentTime,
          isPlaying,
          videoElement
        );
      }
    });
  }

  /**
   * Preloads a video at the specified quality and manages switching the video source smoothly.
   *
   * @param {number} quality - The desired video quality (resolution).
   * @param {number} currentTime - The current playback time to restore after loading.
   * @param {boolean} isPlaying - Indicates whether the video was playing before switching.
   * @param {HTMLVideoElement} videoElement - The video element to update and control.
   */
  private preloadVideoWithQuality(
    quality: number,
    currentTime: number,
    isPlaying: boolean,
    videoElement: HTMLVideoElement
  ) {
    const preloadedVideo = document.createElement('video');
    preloadedVideo.src = this.videoService.getConvertableVideoForResolution(
      this.video!,
      quality
    );
    preloadedVideo.preload = 'auto';

    videoElement.addEventListener('loadedmetadata', () => {
      videoElement.currentTime = currentTime;
      if (isPlaying) videoElement.play();
      this.isLoading = false;
    });

    preloadedVideo.addEventListener('canplaythrough', () => {
      this.switchVideo = true;
      this.videoSrc = preloadedVideo.src;
      this.videoPlayer.nativeElement.currentTime = currentTime;

      setTimeout(() => {
        this.switchVideo = false;
      }, 100);
    });
    console.log('videoquality= ', quality);
    this.openInfoMessage();
  }

  /**
   * Sets up a reactive effect to update the playback speed of the video
   * based on the currently selected speed.
   */
  private setupPlaybackRateEffect() {
    effect(() => {
      this.videoPlayer.nativeElement.playbackRate = this.selectedSpeed();
    });
  }

  /**
   * Sets up a reactive effect to detect if there is saved playback progress
   * and prompt the user to resume playing the video.
   */
  private setupProgressFoundEffect() {
    effect(() => {
      let foundProgress = this.progressFound();
      if (foundProgress) {
        this.openInteractiveMessage(
          'You already played this video. Resume playing?'
        );
      }
    });
  }

  /**
   * Show message of active resolution. After 2s close the message
   */
  showcurrentResolutionMessage() {
    if (this.showFirstMessage) {
      this.isSecondMessage = true;
    }
    this.showSecondMessage = true;
    setTimeout(() => {
      this.closeInfoMessage();
    }, 2000);
  }

  /**
   * Handles the window resize event to update the mobile screen flag.
   *
   * Sets `isMobile` to true if the window width is less than 550 pixels,
   * otherwise sets it to false.
   *
   * @param {Event} event - The resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 550) this.isMobile = true;
    else this.isMobile = false;
  }

  /**
   * Angular lifecycle hook called after component initialization.
   *
   * - Checks for a stored video ID in session storage.
   * - If found, fetches the progress of that video and updates local state.
   * - Also fetches the full list of movies and extracts the title of the video with the stored ID.
   */
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

  /**
   * Loads converted movies by subscribing to the video service.
   *
   * On success, stores the video data and sets the current video and its source quality.
   * Logs any errors to the console.
   */
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

  /**
   * Finds the video in `videoData` matching the video ID stored in session storage.
   *
   * @returns The matched video object if found; otherwise, undefined.
   * Logs a warning if no session video ID is found.
   */
  findSelectedConvertableVideo(): ConvertableVideo | undefined {
    const sessionID = this.loginService.getSessionStorage('videoID');
    if (sessionID) {
      return this.videoData.find((video) => video.id == +sessionID);
    } else {
      console.warn('video not found');
      return undefined;
    }
  }

  /**
   * Determines the video source URL for the given video based on the selected quality.
   *
   * - If a selected quality is set, returns the video URL for that quality.
   * - Otherwise, falls back to the recommended resolution.
   * - Returns an empty string if no quality or video is available.
   *
   * @param {ConvertableVideo} video - The video object to find the quality for.
   * @returns {string} The URL of the video with the appropriate quality or an empty string.
   */
  findQuality(video: ConvertableVideo): string {
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

  /**
   * Toggles playback of the video player.
   *
   * - If the video is paused or ended, it starts playing and sets the play state to true.
   * - If the video is playing, it pauses the video, saves the current playback time via API,
   *   and sets the play state to false.
   */
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

  /**
   * Handles the metadata loaded event for the video.
   *
   * Updates the video's total duration and current playback time,
   * then updates the progress bar accordingly.
   *
   * @param {Event} e - The metadata event.
   * @param {{ duration: number; currentTime: number }} video - The video object containing duration and currentTime.
   */
  onMetadata(e: any, video: { duration: number; currentTime: any }) {
    this.duration.set(video.duration);
    this.currentTime.set(video.currentTime);
    this.updateProgressBar();
  }

  /**
   * Rewinds the video playback by a predefined time interval.
   *
   * Updates the current playback time of the video player by subtracting `timeChangeValue`.
   * Also saves the updated playback time via API if a video is currently loaded.
   */
  replayVideo() {
    this.videoPlayer.nativeElement.currentTime -= this.timeChangeValue;
    if (this.video) this.saveTimeInAPI(this.video?.id, this.timeChangeValue);
  }

  /**
   * Fast-forwards the video playback by a predefined time interval.
   *
   * Increases the current playback time of the video player by `timeChangeValue`.
   * Also saves the updated playback time via API if a video is currently loaded.
   */
  forwardVideo() {
    this.videoPlayer.nativeElement.currentTime += this.timeChangeValue;
    if (this.video) this.saveTimeInAPI(this.video?.id, this.timeChangeValue);
  }

  /**
   * Toggles the mute state of the video.
   *
   * - If the current volume is greater than zero, saves the volume and mutes the video.
   * - If already muted (volume is zero), restores the volume to the saved original level.
   *
   * @param {MouseEvent} event - The mouse event triggering the toggle; default behavior is prevented and propagation stopped.
   */
  toggleMute(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.volume() > 0) {
      this.originalVolume = this.volume();
      this.volume.set(0);
    } else {
      this.volume.set(this.originalVolume);
    }
  }

  /**
   * Work out how much of the media has played via the duration and currentTime parameters
   * Update the progress bar's value
   */
  updateProgressBar() {
    this.timebar = Math.floor(
      (100 / this.videoPlayer.nativeElement.duration) *
        this.videoPlayer.nativeElement.currentTime
    );
    this.currentTime.set(this.videoPlayer.nativeElement.currentTime);
  }

  timeStorage: number | undefined = undefined;

  /**
   * Updates the stored playback progress time and saves it via API.
   *
   * - If the video has ended (currentTime equals duration), resets stored time to 0.
   * - Otherwise, saves the current playback time if at least 5 seconds have passed since the last update.
   * - Ensures progress is only saved if a video is loaded.
   */
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

  /**
   * Saves the current playback time of a video to the backend API.
   *
   * @param {number} id - The ID of the video.
   * @param {number} time - The current playback time in seconds to be saved.
   */
  saveTimeInAPI(id: number, time: number) {
    this.videoService.postSingleMovieProgress(id, time).subscribe();
    this.timestamp = Date.now();
  }

  /**
   * Set the currentTime of the videoplayer and save in API
   */
  changeTime(number: Event) {
    let currentTime = (this.timebar / 100) * this.duration();
    this.videoPlayer.nativeElement.currentTime = currentTime;
    if (this.video) this.saveTimeInAPI(this.video?.id, currentTime);
  }

  /**
   * Formats a duration given in seconds into a time string.
   *
   * Outputs formats like:
   * - "1:01" for 61 seconds,
   * - "4:03:59" for 4 hours, 3 minutes, 59 seconds,
   * - "123:03:59" for durations longer than 99 hours.
   *
   * @param {number} duration - Duration in seconds.
   * @returns {string} Formatted time string.
   */
  timeFormat(duration: number): string {
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

  /**
   * Toggles the full screen mode for the view.
   */
  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
  }

  /**
   * Opens an interactive message toast with the specified text.
   *
   * @param {string} text - The message to display in the error toast.
   */
  openInteractiveMessage(text: string) {
    this.showFirstMessage = true;
    this.initialStateFirstMessage = false;
    this.messageText = text;
  }

  /**
   * Closes the interactive message toast.
   */
  closeInteractiveMessage() {
    this.showFirstMessage = false;
    this.initialStateFirstMessage = false;
  }

  /**
   * Opens an information message
   */
  openInfoMessage() {
    this.showSecondMessage = true;
    this.initialStateSecondMessage = false;
    setTimeout(() => {
      this.closeInfoMessage();
    }, 2000);
  }

  /**
   * Closes the information message toast.
   */
  closeInfoMessage() {
    this.showSecondMessage = false;
    this.initialStateSecondMessage = false;
  }

  /**
   * Resumes video playback from the last saved progress time.
   *
   * Sets the video player's current time to the stored progress and starts playback.
   * Also sets the playback state and closes any open message.
   */
  resumePlaying() {
    this.videoPlayer.nativeElement.currentTime = this.videoProgress.time!;
    this.videoPlayer.nativeElement.play();
    this.isVideoPlay.set(true);
    this.closeInteractiveMessage();
  }
}
