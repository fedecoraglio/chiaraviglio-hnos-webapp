import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../@core/data/auth.service';

@Component({
  selector: 'ngx-app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {

  constructor (private authService: AuthService) {
  }

  ngOnInit() {
    console.info('Entering logout component');
    this.authService.logout();
  }
}
