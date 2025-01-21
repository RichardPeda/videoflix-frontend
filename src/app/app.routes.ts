import { Routes } from '@angular/router';
import { LoginPageComponent } from './layouts/login-layout/login-page/login-page.component';
import { StartPageComponent } from './layouts/start-layout/start-page/start-page.component';
import { RegistrationPageComponent } from './layouts/registration-layout/registration-page/registration-page.component';
import { MainPageComponent } from './layouts/main-layout/main-page/main-page.component';
import { VideoplayerComponent } from './layouts/videoplayer/videoplayer/videoplayer.component';
import { VerifyPageComponent } from './layouts/verify-layout/verify-page/verify-page.component';
import { PwResetPageComponent } from './layouts/password-layout/pw-reset-page/pw-reset-page.component';
import { ResetPasswordComponent } from './layouts/password-layout/reset-password/reset-password.component';

export const routes: Routes = [
    {path: '', component: StartPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'signup', component: RegistrationPageComponent},
    {path: 'verify', component: VerifyPageComponent},
    {path: 'forgot-password', component: PwResetPageComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'overview', component: MainPageComponent},
    {path: 'videoplayer', component: VideoplayerComponent},
];
