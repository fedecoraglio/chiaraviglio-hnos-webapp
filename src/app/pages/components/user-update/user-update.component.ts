import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../@core/data/auth.service';
import { ToasterConfig, Toast, BodyOutputType, ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../@core/data/user.service';

@Component({
  selector: 'ngx-user-update',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {

  submitted: boolean = false;
  user: any = {};
  config: ToasterConfig;
  private titleMessage: string;
  private tokenData: any;

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
    this.titleMessage = this.createMessageTranslate('user.titleUpdate');
    this.loadUserData();
  }

  updateUser(): void {
    this.submitted = true;
    if (this.isValidFormData()) {
      this.userService.updateUserData(this.user).subscribe(() => {
        this.authService.updateCurrentUser(this.user);
        const body = this.createMessageTranslate('user.updateSuccessfully');
        this.showToast('success', this.titleMessage, body);
        this.submitted = false;
        this.changeDetectorRef.detectChanges();
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

  private loadUserData() {
    this.tokenData =  this.authService.getCurrentTokenData();
    if (this.tokenData) {
      this.userService.getUserById(this.tokenData.id).subscribe(
        userData => {
          this.user = userData;
          this.changeDetectorRef.detectChanges();
        },
        error => {
          this.handlerCreateUserError(error);
      });
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
    return this.user && this.user.name;
  }

  private createMessageTranslate(key, defaultMsg = 'Actualizar datos del usuario') {
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
