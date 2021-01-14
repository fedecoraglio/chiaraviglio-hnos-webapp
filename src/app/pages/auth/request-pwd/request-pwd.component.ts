import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../@core/data/auth.service';

@Component({
  selector: 'ngx-request-pwd',
  templateUrl: './request-pwd.component.html',
})
export class RequestPwdComponent implements OnInit {

  user: any;
  submitted: boolean;
  config: ToasterConfig;

  constructor(
    private translateService: TranslateService,
    private toasterService: ToasterService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.user = {
      email: null,
    }
  }

  requestPassword(): void {
    this.submitted = true;
    this.authService.requestPassword(this.user.email).subscribe(
      () => {
        const titleMessage = this.createMessageTranslate('user.requestPasswordTitle');
        const body = this.createMessageTranslate('user.requestPasswordSuccessfully');
        this.showToast('success', titleMessage, body);
        this.submitted = false;
        this.changeDetectorRef.detectChanges();
      }, (err) => {
        this.handlerRequestError(err);
      });
  }

  private handlerRequestError(err): void {
    console.error(err);
    if (err.error) {
      const titleMessage = this.createMessageTranslate('user.requestPasswordTitle');
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['error']);
      this.showToast('error', titleMessage, errorTranslated);
      this.submitted = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private createMessageTranslate(key, defaultMsg = 'Enviar contraseña') {
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
