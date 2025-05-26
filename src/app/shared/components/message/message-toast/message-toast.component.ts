import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-message-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.scss',
})
export class MessageToastComponent {
  messageText = input('');
  messageType = input.required<'info' | 'error'>();
  closeMessage = output<boolean>();

  dismissComponent() {
    this.closeMessage.emit(true);
  }
}
