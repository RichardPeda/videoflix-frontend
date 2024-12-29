import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-quality-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quality-selection.component.html',
  styleUrl: './quality-selection.component.scss'
})
export class QualitySelectionComponent {
qualities = input.required<number[]>()
selectedQuality = model.required<number>()
}
