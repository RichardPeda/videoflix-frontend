import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailPreviewComponent } from './thumbnail-preview.component';

describe('ThumbnailPreviewComponent', () => {
  let component: ThumbnailPreviewComponent;
  let fixture: ComponentFixture<ThumbnailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
