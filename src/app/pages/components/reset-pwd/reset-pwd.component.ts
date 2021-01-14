import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../@core/data/user.service';
import { AuthService } from '../../../@core/data/auth.service';

@Component({
  selector: 'ngx-reset-pwd',
  templateUrl: './reset-pwd.component.html',
})
export class ResetPwdComponent implements OnInit {

  submitted: boolean = false;
  user: any = {};
  config: ToasterConfig;
  private titleMessage: string;
  private userCurrentData: any;

  constructor(
    private translateService: TranslateService,
    private toasterService: ToasterService,
    private authService: AuthService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.submitted = false;
    this.user = {};
    this.userCurrentData = this.authService.getCurrentUser();
    this.titleMessage = this.createMessageTranslate('user.titleResetPwd');
  }

  resetPwd(): void {
    this.submitted = true;
    if (this.isValidFormData()) {
      this.authService.login({
        email: this.userCurrentData.email,
        password: this.user.password,
      }).subscribe(
        loginResponse => {
          if (loginResponse) {
            this.user.id = this.userCurrentData.id;
            this.userService.resetPassword(this.user).subscribe(() => {
              const body = this.createMessageTranslate('user.resetPasswordSuccessfully');
              this.showToast('success', this.titleMessage, body);
              this.submitted = false;
              this.user = {};
              this.changeDetectorRef.detectChanges();
            }, (err) => {
              this.handlerUserPasswordError(err);
            });
          }
        },
        errorLogin => {
          this.handlerUserPasswordError(errorLogin);
        },
      );
    } else {
      const body = this.createMessageTranslate('user.dataNotValid');
      this.showToast('error', this.titleMessage, body);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private handlerUserPasswordError(err): void {
    console.error(err);
    if (err.error) {
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['message']);
      this.showToast('error', this.titleMessage, errorTranslated);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private isValidFormData(): boolean {
    return this.user && this.user.newPassword;
  }

  private createMessageTranslate(key, defaultMsg = 'Cambiar contraseña') {
    const title = this.translateService.instant(key);
    return title === key ? defaultMsg : title;
  }

  private getApiErrorMessageTranslate(code, defaultMsg) {
    return this.createMessageTranslate(`apiError.${code}`, defaultMsg)
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: 'toast-top-right',
      timeout: 30000,
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
