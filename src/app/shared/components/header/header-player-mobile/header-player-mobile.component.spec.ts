import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPlayerMobileComponent } from './header-player-mobile.component';

describe('HeaderPlayerMobileComponent', () => {
  let component: HeaderPlayerMobileComponent;
  let fixture: ComponentFixture<HeaderPlayerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPlayerMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPlayerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
