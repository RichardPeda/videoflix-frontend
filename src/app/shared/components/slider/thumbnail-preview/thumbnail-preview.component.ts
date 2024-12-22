import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-thumbnail-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thumbnail-preview.component.html',
  styleUrl: './thumbnail-preview.component.scss',
})
export class ThumbnailPreviewComponent {
  isBig = false;
  show = false;

  componentGrow() {
    this.isBig = true;
    this.show = true;
  }

  componentShrink(event:MouseEvent){ 
    
    this.isBig = false
    setTimeout(() => {
      this.show = false;

    }, 1000);
  }
}
