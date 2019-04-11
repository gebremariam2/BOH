import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogComponent } from '@shares/dialog.component';
import { Message } from '@shares/message.model';

import { AuthService } from '@cores/auth.service';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  email: string;
  regForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.email = this.data;
    this.regForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get emailFld() { return this.regForm.get('email'); }
  get displayName() { return this.regForm.get('displayName'); }
  get password() { return this.regForm.get('password'); }

  emailError(): string {
    return this.emailFld.errors.email ? 'Username must be a valid email.' : 'Username must not be blank.';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.authService.createRegular(this.regForm.value).then(
      (rtn: Message) => rtn.success ? this.dialogRef.close(rtn.message) : this.openDialog('Error Saving New Registration', rtn.message)
    );
  }

  private openDialog(ttl, msg): void {
    this.dialog.open(
      DialogComponent,
      {
        width: '500px',
        data: {
          title: ttl,
          content: msg
        }
      }
    );
  }
}
