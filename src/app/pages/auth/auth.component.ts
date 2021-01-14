import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import 'style-loader!angular2-toaster/toaster.css';
import { AuthService } from '../../@core/data/auth.service';

@Component({
  selector: 'ngx-app-auth',
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html',
})
export class AuthComponent {

  // showcase of how to use the onAuthenticationChange method
  constructor(
    router: Router,
    translate: TranslateService,
    authService: AuthService) {
      console.info('Entering auth component');
      translate.setDefaultLang('es');
      if (!router.url.includes('/auth/logout')) {
        authService.validateAuthenticated();
      }
  }
}
