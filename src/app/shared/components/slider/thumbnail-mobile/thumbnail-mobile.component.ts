import { Component, inject, input } from '@angular/core';
import { VideoService } from '../../../../core/services/video.service';
import { Video } from '../../../../core/models/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thumbnail-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thumbnail-mobile.component.html',
  styleUrl: './thumbnail-mobile.component.scss',
})
export class ThumbnailMobileComponent {
  private videoService = inject(VideoService);
  selected: number | undefined = undefined;
  genre = input<string>();
  videos = input<Video[] | undefined>(undefined);

  selectVideo(index: number) {
    this.videoService.selectedVideoIdSignal.set(index);
    this.selected = index;
    this.videoService.slideMobileVideo.set(true);
  }
}
