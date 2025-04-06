import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailMobileComponent } from './thumbnail-mobile.component';

describe('ThumbnailMobileComponent', () => {
  let component: ThumbnailMobileComponent;
  let fixture: ComponentFixture<ThumbnailMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
