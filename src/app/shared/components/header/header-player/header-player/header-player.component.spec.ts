import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPlayerComponent } from './header-player.component';

describe('HeaderPlayerComponent', () => {
  let component: HeaderPlayerComponent;
  let fixture: ComponentFixture<HeaderPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
