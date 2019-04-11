import { Component, OnInit } from '@angular/core';

import { AuthService } from '@cores/auth.service';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.logout();
  }
}
