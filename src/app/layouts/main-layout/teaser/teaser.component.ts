import { Component, effect, input } from '@angular/core';
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
  video = input<Video>();
  currentVideo: Video | undefined;

  newVideo: Video | undefined;
  fadeActive = false;

  constructor() {
    effect(() => {
      let video = this.video();
      if (video) {
        if (this.currentVideo == undefined) {
          this.currentVideo = video;
          this.newVideo = video;
        } else {
          this.newVideo = video;
          this.fadeOut(video);
        }
      }
    });
  }

  fadeOut(video: Video) {
    this.fadeActive = true;
    setTimeout(() => {
      this.currentVideo = video;
    }, 1500);
    setTimeout(() => {
      this.fadeActive = false;
    }, 3000);
  }
}
