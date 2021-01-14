import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../@core/data/auth.service';
import { ToasterConfig, Toast, BodyOutputType, ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  submitted: boolean = false;
  errors: string;
  user: any = {};
  config: ToasterConfig;
  private titleMessage: string;

  constructor (
      private translateService: TranslateService,
      private toasterService: ToasterService,
      private authService: AuthService,
      private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.errors = null;
    this.submitted = false;
    this.user = {};
    this.titleMessage = this.createMessageTranslate('auth.register.titleRegisterByEmail');
  }

  register(): void {
    this.errors = null;
    this.submitted = true;
    if (this.isValidFormData()) {
      this.authService.createUser(this.user).subscribe(() => {
        this.login();
      }, (err) => {
        this.handlerCreateUserError(err);
      });
    } else {
      const body = this.createMessageTranslate('auth.register.dataNotValid');
      this.showToast('error', this.titleMessage, body);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private handlerCreateUserError(err): void {
    console.error(err);
    if (err.error) {
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['message']);
      this.showToast('error', this.titleMessage, errorTranslated);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private isValidFormData(): boolean {
    return this.user && this.user.name && this.user.password && this.user.idNumber && this.user.email;
  }

  private login(): void {
    this.authService.login({
      email: this.user.email,
      password: this.user.password,
    }).subscribe((data) => {
      this.authService.handleAuthentication(data.token);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }, (error) => {
      this.errors = error.error;
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    });
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
      limit: 3,
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
