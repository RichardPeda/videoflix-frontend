import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-message-toast',
  standalone: true,
  imports: [],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.scss'
})
export class MessageToastComponent {
 messageText = input('')
 closeMessage = output<boolean>()

 dismissComponent(){
  this.closeMessage.emit(true)
 }
}
