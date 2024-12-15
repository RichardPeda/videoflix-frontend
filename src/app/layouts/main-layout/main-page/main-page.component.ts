import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';

interface SliderControl {
  allowRight: boolean;
  allowLeft: boolean;
  width: number;
  position: number;
  minPosition: number;
}

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  @ViewChild('container') container: ElementRef | undefined;

  size = window.innerWidth;

  slider: SliderControl = {
    allowLeft: false,
    allowRight: false,
    position: 0,
    width: 0,
    minPosition: 0,
  };

  containerRect: any;

  ngOnInit() {
    // console.log(this.size);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');

    let element = this.container?.nativeElement.getBoundingClientRect();
    this.containerRect = this.container?.nativeElement.getBoundingClientRect();
    this.slider.width = element.width;
    this.slider.minPosition = element.x;

    setTimeout(() => {
      let elements = this.container?.nativeElement.children;
      let lastChildPosition = this.getPositionOfLastChild(elements);

      if (lastChildPosition >= this.size) {
        this.slider.allowRight = true;
      }
    }, 1000);

    // console.log(this.slider.width);
    // console.log(this.slider.minPosition);

    // console.log(this.container?.nativeElement.getBoundingClientRect().width);
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  slideRight() {
    this.slider.position += -250;
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
    this.slider.position += 250;
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
