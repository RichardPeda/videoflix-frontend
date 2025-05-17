import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsRankingComponent } from './stars-ranking.component';

describe('StarsRankingComponent', () => {
  let component: StarsRankingComponent;
  let fixture: ComponentFixture<StarsRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarsRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
