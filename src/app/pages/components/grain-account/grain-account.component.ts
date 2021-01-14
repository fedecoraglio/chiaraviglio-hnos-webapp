import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IGrainCurrentAccountModel } from '../../../@core/data/model/grain-account.model';
import { ToasterConfig, ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { AuthService } from '../../../@core/data/auth.service';
import { UserService } from '../../../@core/data/user.service';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-grain-account',
  templateUrl: './grain-account.component.html',
  styleUrls: ['./grain-account.component.scss'],
})
export class GrainAccountComponent implements OnInit {

  grainAccountData: IGrainCurrentAccountModel;
  config: ToasterConfig;
  submitted: boolean;
  searchByCode: string;
  searchByCose: string;
  private limit: number;
  private offset: number;
  private tokenData: any;

  constructor(
    private translateService: TranslateService,
    private toasterService: ToasterService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.limit = 50;
    this.offset = 0;
    this.tokenData =  this.authService.getCurrentTokenData();
    this.grainAccountData = null;
    if (this.tokenData) {
      this.userService.getGrainAccountByUser(this.tokenData.id, this.limit, this.offset).subscribe(
        resp => {
          this.grainAccountData = resp;
          this.changeDetectorRef.detectChanges();
        },
        error => {
          this.handlerGrainAccountError(error);
      });
    }
  }

  searchGrainAccount() {
    this.submitted = true;
    this.userService.getGrainAccountFilter(this.tokenData.id, {
      searchByCode: this.searchByCode,
      searchByCose: this.searchByCose,
    }).subscribe(
      grainDetails => {
        this.grainAccountData.items = [];
        this.createGrainAccountData(grainDetails);
      }, error => {
        this.handlerGrainAccountError(error);
      },
    );
  }

  showMoreData () {
    this.offset = this.offset + this.limit;
    this.getGrainAccountPagination();
  }

  downloadCsvFile() {
    this.userService.exportAllGrainAccount(this.tokenData.id).subscribe(
      data => {
        saveAs(data, `movimientos_de_granos_${new Date().getTime()}.csv`);
      },
      error => {
        console.error(error);
    });
  }

  downloadExcelFile() {
    this.userService.exportAllGrainAccountExcel(this.tokenData.id).subscribe(
      data => {
        saveAs(data, `movimientos_de_granos_${new Date().getTime()}.xlsx`);
      },
      error => {
        console.error(error);
    });
  }

  private getGrainAccountPagination() {
    this.userService.getGrainAccountByUser(this.tokenData.id, this.limit, this.offset).subscribe((grainDetails) => {
      this.createGrainAccountData(grainDetails);
    }, (error) => {
      this.handlerGrainAccountError(error);
    });
  }

  private createGrainAccountData(grainDetails) {
    this.grainAccountData.items = this.grainAccountData.items.concat(grainDetails.items);
    this.grainAccountData.offset = grainDetails.offset;
    this.grainAccountData.limit = grainDetails.limit;
    this.grainAccountData.total = grainDetails.total;
    this.submitted = false;
    this.changeDetectorRef.detectChanges();
  }

  private handlerGrainAccountError(err): void {
    console.error(err);
    if (err.error) {
      const titleMessage = this.createMessageTranslate('grainAccount.title');
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['error']);
      this.showToast('error', titleMessage, errorTranslated);
    }
    this.submitted = false;
    this.changeDetectorRef.detectChanges();
  }

  private createMessageTranslate(key, defaultMsg = 'Movimientos de Granos') {
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
