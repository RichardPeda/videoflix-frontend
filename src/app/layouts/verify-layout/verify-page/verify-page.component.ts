import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header-main/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-verify-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatProgressSpinnerModule],
  templateUrl: './verify-page.component.html',
  styleUrl: './verify-page.component.scss'
})
export class VerifyPageComponent {
    private router = inject(Router);
  

}
