import { Routes } from '@angular/router';
import { LoginPageComponent } from './layouts/login-layout/login-page/login-page.component';
import { StartPageComponent } from './layouts/start-layout/start-page/start-page.component';
import { RegistrationPageComponent } from './layouts/registration-layout/registration-page/registration-page.component';
import { PwResetPageComponent } from './layouts/pw-reset-layout/pw-reset-page/pw-reset-page.component';
import { MainPageComponent } from './layouts/main-layout/main-page/main-page.component';

export const routes: Routes = [
    {path: '', component: StartPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'signup', component: RegistrationPageComponent},
    {path: 'reset', component: PwResetPageComponent},
    {path: 'overview', component: MainPageComponent},
];
