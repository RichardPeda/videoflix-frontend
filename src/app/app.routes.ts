import { Routes } from '@angular/router';
import { LoginPageComponent } from './layouts/login-layout/login-page/login-page.component';
import { StartPageComponent } from './layouts/start-layout/start-page/start-page.component';

export const routes: Routes = [
    // {path: '', component: StartPageComponent},
    {path: '', component: LoginPageComponent}
];
