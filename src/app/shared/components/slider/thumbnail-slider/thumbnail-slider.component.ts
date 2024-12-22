import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SliderControl {
  allowRight: boolean;
  allowLeft: boolean;
  width: number;
  position: number;
  minPosition: number;
}

@Component({
  selector: 'app-thumbnail-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thumbnail-slider.component.html',
  styleUrl: './thumbnail-slider.component.scss'
})
export class ThumbnailSliderComponent {
 @ViewChild('container') container: ElementRef | undefined;
  @ViewChild('thumbnail') thumbnail: ElementRef | undefined;

  size = window.innerWidth;
  offsetPosition = 0;
  offsetGap = 12;

  slider: SliderControl = {
    allowLeft: false,
    allowRight: false,
    position: 0,
    width: 0,
    minPosition: 0,
  };

  ngAfterViewInit() {
    console.log('ngAfterViewInit');

    let element = this.container?.nativeElement.getBoundingClientRect();
    let thumb = this.thumbnail?.nativeElement.getBoundingClientRect();
    this.offsetPosition = thumb.width;
    console.log(this.offsetPosition);
    
    this.slider.width = element.width;
    this.slider.minPosition = element.x;

    setTimeout(() => {
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition >= this.size) {
        this.slider.allowRight = true;
      }
    }, 1000);

   
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  slideRight() {
    // this.slider.position += -250;
    this.slider.position += -(this.offsetPosition+this.offsetGap);
    setTimeout(() => {
      if (this.container?.nativeElement.getBoundingClientRect().x <= 0) {
        this.slider.allowLeft = true;
      }
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition <= this.size) {
        this.slider.allowRight = false;
      }
    }, 1000);
  }

  getPositionOfLastChild(children: any) {
    let last = children.item(children.length - 1);
    return last.getBoundingClientRect().right;
  }

  slideLeft() {
    this.slider.position += (this.offsetPosition+this.offsetGap);
    setTimeout(() => {
      if (this.container?.nativeElement.getBoundingClientRect().x >= 0) {
        this.slider.allowLeft = false;
      }
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition >= this.size) {
        this.slider.allowRight = true;
      }
    }, 1000);
  }
}


