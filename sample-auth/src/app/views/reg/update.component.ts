import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

import { DialogComponent } from '@shares/dialog.component';
import { Message } from '@shares/message.model';

import { AuthService } from '@cores/auth.service';

@Component({
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  email = '';
  userName = '';
  isLoggedIn = false;
  acctForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private firebaseAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.firebaseAuth.authState.subscribe(
      (user: User) => {
        if (user) {
          this.isLoggedIn = user.emailVerified;
          this.email = user.email;
          this.userName = user.displayName;
        } else {
          this.isLoggedIn = false;
          this.email = '';
          this.userName = '';
        }
        this.initForm();
      }
    );
  }

  get displayName() { return this.acctForm.get('displayName'); }

  onSubmit(): void {
    const frm = this.acctForm.value;

    this.authService.update(frm.displayName, '').then(
      (rtn: Message) => {
        if (rtn.success) {
          this.openDialog('Account Updated', rtn.message, true);
        } else {
          this.openDialog('Error Updating Account', rtn.message);
        }
      }
    );
  }

  private initForm(): void {
    this.acctForm = this.formBuilder.group({
      displayName: [ this.userName, Validators.required ]
    });
  }

  private openDialog(ttl: string, msg: string, doNext?: boolean): void {
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

    if (doNext) {
      dialogRef.afterClosed().subscribe(() => this.router.navigate(['/home']));
    }
  }
}
