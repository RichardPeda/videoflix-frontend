import { Component } from '@angular/core';
import { PrivacyHeaderComponent } from '../../shared/components/header/privacy-header/privacy-header.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [PrivacyHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
