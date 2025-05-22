import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { MouseOutsideDirective } from '../../../directives/mouse-outside.directive';

@Component({
  selector: 'app-thumbnail-preview',
  standalone: true,
  imports: [CommonModule, MouseOutsideDirective],
  templateUrl: './thumbnail-preview.component.html',
  styleUrl: './thumbnail-preview.component.scss',
})
export class ThumbnailPreviewComponent {
  isBig = false;
  show = false;
  growing = false;

  componentGrow() {
    if (!this.isBig) {
      this.isBig = true;
      this.show = true;
      this.growing = true;
      setTimeout(() => {
        this.growing = false;
      }, 500);
    }
  }

  componentShrink() {
    if (this.isBig) {
      if (!this.growing) {
        this.isBig = false;
        setTimeout(() => {
          this.show = false;
        }, 500);
      }
    }
  }
}
