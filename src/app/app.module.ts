import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config = {    apiKey: "AIzaSyAOivwmNprZq9amFjJUPAaS3L4Vrd0XJIs",
authDomain: "bohv1-7446b.firebaseapp.com",
databaseURL: "https://bohv1-7446b.firebaseio.com",
projectId: "bohv1-7446b",
storageBucket: "bohv1-7446b.appspot.com",
messagingSenderId: "1008832006553"}

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
