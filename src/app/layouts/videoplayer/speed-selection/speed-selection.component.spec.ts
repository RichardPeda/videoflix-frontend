import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedSelectionComponent } from './speed-selection.component';

describe('SpeedSelectionComponent', () => {
  let component: SpeedSelectionComponent;
  let fixture: ComponentFixture<SpeedSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
