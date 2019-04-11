import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import { SharedModule } from './shared/shared.module';

import { HttpAuthInterceptor } from './services/http-interceptor.service';

import { AppComponent } from './views/app.component';
import { BannedComponent } from './views/banned.component';
import { DeletedComponent } from './views/deleted.component';
import { LoginComponent } from './views/login.component';
import { LogoutComponent } from './views/logout.component';
import { PageNotFoundComponent } from './views/not-found.component';

import { RegisterComponent } from './views/reg/register.component';
import { UpdateComponent } from './views/reg/update.component';
import { VerifyComponent } from './views/reg/verify.component';

import { AppRouting } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AngularFireModule,
    AngularFireAuthModule,
    AppRouting
  ],
  declarations: [
    AppComponent,
    BannedComponent,
    DeletedComponent,
    LoginComponent,
    LogoutComponent,
    PageNotFoundComponent,
    RegisterComponent,
    UpdateComponent,
    VerifyComponent
  ],
  entryComponents: [
    RegisterComponent
  ],
  providers: [
    { provide: FirebaseOptionsToken, useValue: environment.firebase },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
