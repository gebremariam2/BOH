import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth-guard.service';

import { BannedComponent } from './views/banned.component';
import { DeletedComponent } from './views/deleted.component';
import { LoginComponent } from './views/login.component';
import { LogoutComponent } from './views/logout.component';
import { PageNotFoundComponent } from './views/not-found.component';
import { UpdateComponent } from './views/reg/update.component';
import { VerifyComponent } from './views/reg/verify.component';

export const AppRoutes: Routes = [
  { path: 'banHammer', component: BannedComponent },
  { path: 'deleted', component: DeletedComponent },
  { path: 'login/:msg', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'update', component: UpdateComponent, canActivate: [AuthGuard] },
  { path: 'verify', component: VerifyComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRouting {}
