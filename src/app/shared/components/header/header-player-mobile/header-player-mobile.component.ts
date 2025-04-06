import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-header-player-mobile',
  standalone: true,
  imports: [],
  templateUrl: './header-player-mobile.component.html',
  styleUrl: './header-player-mobile.component.scss'
})
export class HeaderPlayerMobileComponent {
  private router = inject(Router)
  private location = inject(Location)
  name = input<string>()
  
  navigateBack(){
    this.location.back()
  }
}
