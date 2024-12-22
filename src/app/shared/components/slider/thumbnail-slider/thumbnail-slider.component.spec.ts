import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailSliderComponent } from './thumbnail-slider.component';

describe('ThumbnailSliderComponent', () => {
  let component: ThumbnailSliderComponent;
  let fixture: ComponentFixture<ThumbnailSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
