import { Component, inject } from '@angular/core';
import { Location } from '@angular/common'


@Component({
  selector: 'app-privacy-header',
  standalone: true,
  imports: [],
  templateUrl: './privacy-header.component.html',
  styleUrl: './privacy-header.component.scss'
})
export class PrivacyHeaderComponent {
private location = inject(Location)
 

navigateBack(){
  this.location.back()
}
}
