import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  model,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-volume-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-bar.component.html',
  styleUrl: './volume-bar.component.scss',
})
export class VolumeBarComponent {
  volume = model.required<number>();

  @ViewChild('volumeControl') volumeControl!: ElementRef;

  showValue = false;

  constructor() {
    effect(() => {
      let volumeTemp = this.volume();
      this.showValue = true;
      setTimeout(() => {
        this.showValue = false;
      }, 3000);
      this.setVolumeOfControl();
    });
  }

  ngAfterViewInit() {
    let control = this.volumeControl;
    if (control) {
      this.setVolumeOfControl();
    }
  }

  setVolumeOfControl() {
    this.volumeControl.nativeElement.value = this.volume();
  }

  setVolume(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.volume.set(this.volumeControl.nativeElement.value);
  }
}
