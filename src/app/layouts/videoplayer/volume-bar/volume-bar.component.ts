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

  @ViewChild('volume') volumeControl!: ElementRef;

  constructor() {
    effect(() => {
      let volume = this.volume();
      this.setVolume();
    });
  }

  ngAfterViewInit() {
    let control = this.volumeControl;
    if (control) {
      this.setVolume();
    }
  }

  setVolume() {
    this.volumeControl.nativeElement.value = this.volume();
  }

  logVolume(event:Event) {
    event.preventDefault()
    event.stopPropagation()
    this.volume.set(this.volumeControl.nativeElement.value);
  }
}
