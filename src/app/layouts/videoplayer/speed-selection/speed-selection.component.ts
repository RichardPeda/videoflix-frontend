import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-speed-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speed-selection.component.html',
  styleUrl: './speed-selection.component.scss'
})
export class SpeedSelectionComponent {

speeds = input.required<number[]>()
selectedSpeed = model.required<number>()

}
