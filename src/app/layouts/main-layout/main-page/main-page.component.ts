import {
  Component,
  ElementRef,
  inject,
  HostListener,
  Self,
  effect,
} from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ThumbnailSliderComponent } from '../../../shared/components/slider/thumbnail-slider/thumbnail-slider.component';
import { ThumbnailPreviewComponent } from '../../../shared/components/slider/thumbnail-preview/thumbnail-preview.component';
import { TeaserComponent } from '../teaser/teaser.component';
import {
  ConvertableVideo,
  Video,
  VideoProgress,
} from '../../../core/models/video';
import { VideoService } from '../../../core/services/video.service';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { Genre } from '../../../core/models/genre';
import { LoginService } from '../../../core/services/login.service';
import { ThumbnailMobileComponent } from '../../../shared/components/slider/thumbnail-mobile/thumbnail-mobile.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ThumbnailSliderComponent,
    TeaserComponent,
    ThumbnailMobileComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  public videoService = inject(VideoService);
  private loginService = inject(LoginService);

  contentSize = 0;
  screenWidth = 0;
  isScreenMobile = false;

  videoData: Video[] = [];
  videoForTeaser: Video | undefined;
  teaserVideoSrc: string = '';

  videoIndex = 0;

  genres: 'SEEN' | 'NEW' | 'DOKUMENTARY' | 'ACTION' | 'ROMANTIC' | 'DRAMA' =
    'DOKUMENTARY';

  genreTitles = [
    'Resume',
    'New on Videoflix',
    'Dokumentary',
    'Action',
    'Romantic',
    'Drama',
  ];

  videoArray: Video[][] = [];
  convertVideoArray: ConvertableVideo[] = [];

  seenVideos: Video[] = [];
  newVideos: Video[] = [];
  documantaryVideos: Video[] = [];
  actionVideos: Video[] = [];
  romanticVideos: Video[] = [];
  dramaVideos: Video[] = [];
  VideosInProgress: VideoProgress[] = [];
  mobileVideoChange = false;

  /**
   * Initializes the component by setting screen-related values and subscribing to video selection changes.
   *
   * This constructor performs the following:
   * - Stores a reference to the host DOM element
   * - Detects the current screen width and whether the screen is considered "mobile"
   * - Configures the recommended video size in the video service
   * - Sets up a reactive effect that updates the teaser video when the selected video ID changes
   * - Loads any persisted video progress via `loadProgress()`
   *
   * @param {ElementRef} element - A reference to the component's host DOM element
   */
  constructor(@Self() private element: ElementRef) {
    this.screenWidth = window.innerWidth;
    this.isScreenMobile = this.checkIfSreenMobile(window.innerWidth);
    this.videoService.setBestVideoSize(window.innerWidth);
    effect(
      () => {
        let selectedVideo = this.videoService.selectedVideoIdSignal();
        if (selectedVideo) {
          this.videoForTeaser = this.videoData.find(
            (video) => video.id == selectedVideo
          );
          this.getTeaser(selectedVideo);
        }
      },
      { allowSignalWrites: true }
    );
    this.loadProgress();
  }

  /**
   * Check if the screen is mobile
   * @param width window width
   * @returns true, if width is smaller than 555px, otherwise false
   */
  checkIfSreenMobile(width: number) {
    if (width < 555) return true;
    else return false;
  }

  /**
   * Load the progress of all movies. When finished, load videos.
   */
  loadProgress() {
    this.videoService.getMoviesProgress().subscribe({
      next: (progress: any) => {
        if (progress) {
          this.VideosInProgress = progress;
        }
      },
      complete: () => this.loadVideos(),
    });
  }

  /**
   * Load all videos. When finished, sort the videos and load the converted videos.
   */
  loadVideos() {
    this.videoService.getMovies().subscribe({
      next: (data: any) => {
        this.videoData = data;
      },
      complete: () => {
        this.sortVideosForGenre();
        this.loadConvertableVideos();
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * Load the converted videos and save to array. When finished, load the teaser.
   */
  loadConvertableVideos() {
    this.videoService.getConvertedMovies().subscribe({
      next: (data: any) => {
        this.convertVideoArray = data;

        const id = sessionStorage.getItem('videoID');
        if (id) this.getTeaser(+id);
        else this.getFirstTeaser();
      },
      error: (err) => console.log(err),
    });
  }

  ngAfterContentInit() {
    this.contentSize = this.element.nativeElement.offsetWidth;
  }

  /**
   * Handles window resize events and updates layout-related properties accordingly.
   *
   * This method is triggered whenever the browser window is resized. It updates:
   * - the optimal video size via the video service,
   * - the current content width,
   * - the screen width,
   * - and whether the layout should be considered "mobile".
   *
   * It also propagates the mobile state to the video service.
   * @param event window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.videoService.setBestVideoSize(window.innerWidth);
    this.contentSize = this.element.nativeElement.offsetWidth;
    this.screenWidth = window.innerWidth;
    this.isScreenMobile = this.checkIfSreenMobile(window.innerWidth);
    this.videoService.isScreenMobile = this.checkIfSreenMobile(
      window.innerWidth
    );
  }

  /**
   * Sorts videos by genre and populates categorized arrays accordingly.
   *
   * This method iterates through all available video data and distributes videos
   * into different genre-specific arrays such as 'new', 'documentary', 'action',
   * 'romantic', and 'drama'. If a video has already been watched (determined by
   * matching IDs in VideosInProgress), it is added to the 'seen' category.
   *
   * After sorting, all genre arrays are stored in a master video array (indexed by Genre enum),
   * and a teaser video is selected using the `findFirstVideo()` method.
   */
  sortVideosForGenre() {
    let genre = Genre;

    this.videoData.forEach((video) => {
      let videoAllreadyPlayed = this.VideosInProgress.find(
        (process) => process.movie == video.id
      );

      if (videoAllreadyPlayed) this.seenVideos.push(video);
      else if (video.genre == 'NEW') {
        this.newVideos.push(video);
      } else if (video.genre == 'DOCUMENTARY') {
        this.documantaryVideos.push(video);
      } else if (video.genre == 'ACTION') {
        this.actionVideos.push(video);
      } else if (video.genre == 'ROMANTIC') {
        this.romanticVideos.push(video);
      } else if (video.genre == 'DRAMA') {
        this.dramaVideos.push(video);
      }
    });

    this.videoArray[genre.seen] = [...this.seenVideos];
    this.videoArray[genre.new] = [...this.newVideos];
    this.videoArray[genre.action] = [...this.actionVideos];
    this.videoArray[genre.documentary] = [...this.documantaryVideos];
    this.videoArray[genre.romantic] = [...this.romanticVideos];
    this.videoArray[genre.drama] = [...this.dramaVideos];

    this.videoForTeaser = this.findFirstVideo(this.videoArray);
  }

  /**
   * Finds and returns the first available video from a 2D video array.
   *
   * Iterates through each sub-array (representing a genre or category) and
   * returns the first video found. If all sub-arrays are empty, returns undefined.
   *
   * @param multiArray {Video[][]} A two-dimensional array of videos grouped by genre
   * @returns {Video | undefined} The first available video found, or undefined if none exist
   */
  findFirstVideo(multiArray: Video[][]): Video | undefined {
    let teaser;
    for (let index = 0; index < multiArray.length; index++) {
      const firstDimension = multiArray[index];
      if (firstDimension.length > 0) {
        teaser = firstDimension[0];
      }
    }
    return teaser;
  }

  /**
   * Finds and sets the video source for the teaser video based on the recommended resolution.
   *
   * This method checks if a teaser video (`videoForTeaser`) is set and whether a list of
   * converted videos (`convertVideoArray`) is available. It then searches for a matching
   * converted video by comparing the movie ID. If a match is found, the appropriate video
   * source for the recommended resolution is retrieved and assigned to `teaserVideoSrc`.
   * The teaser video ID is also stored using `saveVideoID()`.
   */
  getFirstTeaser() {
    if (this.videoForTeaser && this.convertVideoArray) {
      this.convertVideoArray.find((convert) => {
        if (convert.movie === this.videoForTeaser?.id) {
          this.teaserVideoSrc =
            this.videoService.getConvertableVideoForResolution(
              convert,
              this.videoService.recommendedResolution()
            );
          this.saveVideoID(this.videoForTeaser.id);
        }
      });
    }
  }

  /**
   * Finds and prepares the teaser video and its source based on a given video ID.
   *
   * This method searches the list of converted videos (`convertVideoArray`) for a video
   * that matches the given `findId`. If a match is found, it:
   * - Retrieves the corresponding original video from `videoData`
   * - Selects the appropriate video source based on the recommended resolution
   * - Sets both the teaser video and its source
   * - Stores the video ID using `saveVideoID()`
   *
   * @param {number} findId - The ID of the video to be used as a teaser
   */
  getTeaser(findId: number) {
    if (this.convertVideoArray) {
      this.convertVideoArray.find((convert) => {
        if (convert.movie === findId) {
          this.videoForTeaser = this.videoData.find(
            (video) => video.id == findId
          );
          this.teaserVideoSrc =
            this.videoService.getConvertableVideoForResolution(
              convert,
              this.videoService.recommendedResolution()
            );
          this.saveVideoID(findId);
        }
      });
    }
  }

  /**
   * Stores the video Id in the session storage
   * @param videoID video id
   */
  saveVideoID(videoID: number) {
    this.loginService.setSessionStorage('videoID', videoID.toString());
  }
}
