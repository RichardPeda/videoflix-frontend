import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'


@Component({
  selector: 'app-header-player',
  standalone: true,
  imports: [],
  templateUrl: './header-player.component.html',
  styleUrl: './header-player.component.scss'
})
export class HeaderPlayerComponent {
private router = inject(Router)
private location = inject(Location)
 name = input<string>()

navigateBack(){
  this.location.back()
}
}
