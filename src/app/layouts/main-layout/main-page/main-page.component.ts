import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ThumbnailSliderComponent } from '../../../shared/components/slider/thumbnail-slider/thumbnail-slider.component';
import { ThumbnailPreviewComponent } from '../../../shared/components/slider/thumbnail-preview/thumbnail-preview.component';



@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ThumbnailSliderComponent, ThumbnailPreviewComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChild('thumbnail') thumbnail: ElementRef | undefined;

  size = window.innerWidth;
  offsetPosition = 0;
  offsetGap = 12;


  
}
  