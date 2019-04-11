import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

import { DialogComponent } from '@shares/dialog.component';

import { AuthService } from '@cores/auth.service';

@Component({
  templateUrl: './verify.component.html'
})
export class VerifyComponent {
  constructor(public dialog: MatDialog, private firebaseAuth: AngularFireAuth, private authService: AuthService, private router: Router) {
    this.firebaseAuth.authState.subscribe(
      (user: User) => {
        if (!!!user) {
          this.openDialog('You need to be logged in before trying to verify your email address.', 'Please Login', '/login');
        } else if (user.emailVerified) {
          this.openDialog('Your email address has already been verified, thank you!');
        }
      }
    );
  }

  verify(): void {
    this.authService.verify().then(() => {
      this.openDialog('A verification email has been sent to your address.');
    }).catch(e => {
      this.openDialog(e.message, 'Email Error');
    });
  }

  private openDialog(msg: string, ttl?: string, path?: string): void {
    if (!ttl) {
      ttl = 'Email Verification';
    }
    if (!path) {
      path = '/home';
    }
    const dialogRef = this.dialog.open(
      DialogComponent,
      {
        width: '500px',
        data: {
          title: ttl,
          content: msg
        }
      }
    );

    dialogRef.afterClosed().subscribe(() => this.router.navigate([path]));
  }
}
