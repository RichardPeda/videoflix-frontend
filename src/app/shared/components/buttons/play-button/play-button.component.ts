import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [],
  templateUrl: './play-button.component.html',
  styleUrl: './play-button.component.scss'
})
export class PlayButtonComponent {
private router = inject(Router)

navigateToPlayer(){
  this.router.navigate(['/videoplayer'])
}


}
