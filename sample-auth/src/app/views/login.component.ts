import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '@cores/auth.service';
import { DialogComponent } from '@shares/dialog.component';

import { RegisterComponent } from './reg/register.component';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  message: string;
  private subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    public snack: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(
      (map: ParamMap) => {
        if (map.has('msg')) {
          this.message = 'Please login to continue!';
        }
      }
    );
    this.loginForm = this.formBuilder.group({
      UserName: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  get UserName() { return this.loginForm.get('UserName'); }
  get Password() { return this.loginForm.get('Password'); }

  emailError(): string {
    return this.UserName.errors.email ? 'Username must be a valid email.' : 'Username must not be blank.';
  }

  login(): void {
    const frm = this.loginForm.value;
    const next = this.authService.redirectURL;

    this.authService.signInWithEmail(frm.UserName, frm.Password)
      .then(() => {
        this.authService.redirectURL = '/products';
        this.router.navigate([next]);
      })
      .catch(err => err.code === 'auth/user-not-found' ? this.onRegister() : this.openDialog(err.message));
  }

  onRegister(): void {
    const frm = this.loginForm.value;

    const dialogRef = this.dialog.open(
      RegisterComponent,
      {
        width: '500px',
        data: frm.UserName
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.snack.open(result, 'Got it!', { duration: 5000 });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private openDialog(msg: string): void {
    this.dialog.open(
      DialogComponent,
      {
        width: '500px',
        data: {
          title: 'Login Failed',
          content: msg
        }
      }
    );
  }
}
