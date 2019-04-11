import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';

import { environment } from '@envs/environment';

import { Message } from '@shares/message.model';

import { IdService } from '@cores/id.service';
import { Mail, MailerService } from '@cores/mailer.service';

const server = environment.server;

export interface FBAuthUser {
  email: string;
  displayName: string;
  password?: string;
  photoUrl: string;
  emailVerified: boolean;
  uid: string;
  token: string;
}

interface NodeUser {
  Id: string;
  FirstName: string;
  LastName: string;
  ScreenName: string;
  Email: string;
  SelfRegistered: boolean;
}

interface NodeUserMap {
  Id: string;
  GroupAdmin: boolean;
  UserId: string;
  DateBanned: Date;
}

export interface UserStatus {
  User: boolean;
  Verified: boolean;
  Banned: boolean;
  Deleted: boolean;
  Admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fbUser: User;
  private emptyStatus: UserStatus = {
    User: false,
    Verified: false,
    Banned: false,
    Deleted: false,
    Admin: false
  };
  private userStatus: UserStatus = this.emptyStatus;
  private emptyUser: FBAuthUser = {
    email: '',
    displayName: '',
    photoUrl: '',
    emailVerified: false,
    uid: '',
    token: ''
  };
  private u: FBAuthUser = this.emptyUser;

  // store the URL to redirect to after login
  redirectURL = '/products';

  constructor(
    private http: HttpClient,
    private router: Router,
    private firebaseAuth: AngularFireAuth,
    private idService: IdService,
    private mailer: MailerService
  ) {
    firebaseAuth.auth.onAuthStateChanged(
      (user: User) => {
        if (user) {
          // user is logged in
          this.fbUser = user;
          this.u = {
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            emailVerified: user.emailVerified,
            uid: user.uid,
            token: ''
          };
          user.getIdToken().then(t => {
            this.u.token = t;
            this.setUserStatus();
          });
        } else {
          // user is not logged in, so reset
          this.fbUser = null;
          this.u = this.emptyUser;
          this.userStatus = this.emptyStatus;
        }
      }
    );
  }

  authenticated(): boolean {
    return this.u.emailVerified;
  }

  checkUserStatus(): Observable<UserStatus> {
    return of(this.userStatus);
  }

  async createRegular(reg: FBAuthUser): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    try {
      const u = await this.firebaseAuth.auth.createUserWithEmailAndPassword(reg.email, reg.password);
      try {
        await u.user.updateProfile({ displayName: reg.displayName, photoURL: '' });
        msg.message = 'You have been registered successfully.';
        this.insertDB({
          Id: u.user.uid,
          FirstName: '',
          LastName: '',
          ScreenName: reg.displayName,
          Email: reg.email,
          SelfRegistered: true
        });
        try {
          await this.verify();
          const body: Mail = {
            Subject: 'WanaxWorx SAT: New user registered',
            EmailTo: 'jason@wanax.com',
            Message: this.mailer.formatForm(reg)
          };
          this.mailer.send(body).subscribe();
          msg.success = true;
          msg.message += ' Please look for your verification email!';
          return msg;
        } catch (err) {
          msg.message += ' There was a problem sending your verification email. ' + err.message;
          return msg;
        }
      } catch (error) {
        msg.message += ' There was a problem getting everything setup. Please try to login.' + error.message;
        return msg;
      }
    } catch (e) {
      msg.message = e.message;
      return msg;
    }
  }

  getParams(): {} {
    return {
      access_token: this.u.token,
      x_un: this.u.email,
      x_key: this.u.uid
    };
  }

  logout(): void {
    this.redirectURL = '/home';
    this.firebaseAuth.auth.signOut().then(() => this.router.navigate(['/home']));
  }

  signInWithEmail(email: string, password: string): Promise<any> {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async update(name: string, photoUrl: string): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    try {
      await this.fbUser.updateProfile({
        displayName: name,
        photoURL: photoUrl
      });
      this.updateDB({
        Id: this.u.uid,
        FirstName: '',
        LastName: '',
        ScreenName: name,
        Email: this.u.email,
        SelfRegistered: true
      });
      msg.success = true;
      msg.message = 'Your account has been updated successfully.';
      return msg;
    } catch (e) {
      msg.message = e.message;
      return msg;
    }
  }

  verify(): Promise<any> {
    return this.fbUser.sendEmailVerification();
  }

  private insertDB(user: NodeUser): void {
    this.http.post(
      server + '/api/core/user',
      JSON.stringify({ ...user, MapId: this.idService.newID() })
    ).subscribe();
  }

  private setUserStatus(): void {
    this.userStatus = this.emptyStatus;
    this.userStatus.User = !!this.fbUser;
    if (this.u.emailVerified) {
      this.userStatus.Verified = true;
      this.http.get(server + '/api/core/user').subscribe(
        (data: NodeUserMap) => {
          if (data) {
            this.userStatus.Banned = !!data.DateBanned;
            this.userStatus.Admin = data.GroupAdmin;
          }
        },
        () => this.userStatus.Deleted = true
      );
    }
  }

  private updateDB(user: NodeUser): void {
    this.http.put(
      server + '/api/core/user',
      JSON.stringify(user)
    ).subscribe();
  }
}
