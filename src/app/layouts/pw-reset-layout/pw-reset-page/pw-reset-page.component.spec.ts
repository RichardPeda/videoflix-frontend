import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwResetPageComponent } from './pw-reset-page.component';

describe('PwResetPageComponent', () => {
  let component: PwResetPageComponent;
  let fixture: ComponentFixture<PwResetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwResetPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
