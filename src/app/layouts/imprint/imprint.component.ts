import { Component } from '@angular/core';
import { PrivacyHeaderComponent } from '../../shared/components/header/privacy-header/privacy-header.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [PrivacyHeaderComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
