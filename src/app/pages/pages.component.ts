import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../@core/data/auth.service';
import { registerLocaleData } from '@angular/common';
import localeAR from '@angular/common/locales/es-AR';
import { TranslateService } from '@ngx-translate/core';

import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {

  constructor(private authService: AuthService, private translate: TranslateService) {

  }

  menu = MENU_ITEMS;

  ngOnInit() {
    registerLocaleData(localeAR, 'es-AR');
    this.translate.setDefaultLang('es-AR');
    this.authService.validateAuthenticated();
  }
}
