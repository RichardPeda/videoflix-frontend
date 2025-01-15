import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss'
})
export class ErrorToastComponent {
 errorText = input('')
 closeMessage = output<boolean>()

 dismissComponent(){
  this.closeMessage.emit(true)
 }
}
