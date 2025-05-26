import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-message-toast-interactive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-toast-interactive.component.html',
  styleUrl: './message-toast-interactive.component.scss'
})
export class MessageToastInteractiveComponent {
 errorText = input.required<string>()
 messageType = input.required<'info' | 'error'>();
 closeMessage = output<boolean>()
 acceptMessage = output<boolean>()

 dismissComponent(){
  this.closeMessage.emit(true)
 }
 acceptAndClose(){
  this.acceptMessage.emit(true)
 }
}
