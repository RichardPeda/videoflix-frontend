import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderPlayerComponent } from '../../../shared/components/header/header-player/header-player/header-player.component';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, HeaderPlayerComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

}
