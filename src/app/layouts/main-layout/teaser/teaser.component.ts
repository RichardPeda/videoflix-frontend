import { Component, input } from '@angular/core';
import { Video } from '../../../core/models/video';
import { PlayButtonComponent } from '../../../shared/components/buttons/play-button/play-button.component';

@Component({
  selector: 'app-teaser',
  standalone: true,
  imports: [PlayButtonComponent],
  templateUrl: './teaser.component.html',
  styleUrl: './teaser.component.scss'
})
export class TeaserComponent {
  video = input<Video>()
}
