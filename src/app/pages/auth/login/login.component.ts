import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthService } from '../../../@core/data/auth.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  user: any = {};
  submitted: boolean = false;
  emailToForgotPassword: string;
  config: ToasterConfig;

  constructor (
    private translateService: TranslateService,
    private toasterService: ToasterService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.info('Entering login component');
    this.user = {};
    this.submitted = false;
  }

  login(): void {
    this.authService.cleanUserData();
    this.submitted = true;
    if (this.user.email && this.user.password) {
      this.authService.login(this.user).subscribe((data) => {
        this.authService.handleAuthentication(data.token);
      }, (error) => {
        this.handlerLoginError(error);
      });
    } else {
      const titleMessage = this.createMessageTranslate('auth.login.title');
      const body = this.createMessageTranslate('auth.login.dataNotValid');
      this.showToast('error', titleMessage, body);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private handlerLoginError(err): void {
    console.error(err);
    if (err.error) {
      const titleMessage = this.createMessageTranslate('auth.login.title');
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['error']);
      this.showToast('error', titleMessage, errorTranslated);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private createMessageTranslate(key, defaultMsg = 'Not message provided') {
    const title = this.translateService.instant(key);
    return title === key ? defaultMsg : title;
  }

  private getApiErrorMessageTranslate(code, defaultMsg) {
    return this.createMessageTranslate(`apiError.${code}`, defaultMsg)
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: 'toast-top-right',
      timeout: 60000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'fade',
      limit: 1,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 60000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }
}
