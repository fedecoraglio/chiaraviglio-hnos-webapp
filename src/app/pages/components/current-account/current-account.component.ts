import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../@core/data/user.service';
import { AuthService } from '../../../@core/data/auth.service';
import { ICurrentAccountModel } from '../../../@core/data/model/current-account.model';
import { Toast, BodyOutputType, ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

const FILTER_BY_CREATED_DATE = 'byCreatedDate';
const FILTER_BY_EXPIRATION_DATE = 'byExpirationDate';

@Component({
  selector: 'ngx-current-account',
  templateUrl: './current-account.component.html',
  styleUrls: ['./current-account.component.scss'],
})
export class CurrentAccountComponent implements OnInit {

  currentAccountData: ICurrentAccountModel;
  config: ToasterConfig;
  submitted: boolean;
  filterDateOption: any = FILTER_BY_CREATED_DATE;
  byCreatedDate: string = FILTER_BY_CREATED_DATE;
  byExpirationDate: string = FILTER_BY_EXPIRATION_DATE;
  startDate: Date;
  endDate: Date;

  private limit: number;
  private offset: number;
  private tokenData: any;

  constructor (
      private translateService: TranslateService,
      private toasterService: ToasterService,
      private changeDetectorRef: ChangeDetectorRef,
      private userService: UserService,
      private authService: AuthService) {

  }

  ngOnInit () {
    this.limit = 50;
    this.offset = 0;
    this.tokenData =  this.authService.getCurrentTokenData();
    this.currentAccountData = null;
    if (this.tokenData) {
      this.userService.getCurrentAccountByUser(this.tokenData.id, this.limit, this.offset).subscribe(
        accountDetails => {
          this.currentAccountData = accountDetails;
          const ticketType = this.authService.getTicketTypesLabel();
          for (const item of this.currentAccountData.items) {
            item['ticketType']  = ticketType[item.tipF];
          }
          this.changeDetectorRef.detectChanges();
      },
        error => {
          this.handlerCurrentAccountError(error);
      });
    }
  }

  showMoreData () {
    this.offset = this.offset + this.limit;
    this.getCurrentAccountPagination();
  }

  toggleFilterDateOption (dateOption) {
    this.filterDateOption = dateOption;
  }

  searchCurrentAccount () {
    this.submitted = true;
    if (!this.startDate || !this.endDate) {
      this.currentAccountData.items = [];
      this.limit = 50;
      this.offset = 0;
      this.getCurrentAccountPagination();
    } else {
      const dataFilter = {
        createdStartDate: null,
        createdEndDate: null,
        expirationStartDate: null,
        expirationEndDate: null,
      }
      if (this.filterDateOption === FILTER_BY_EXPIRATION_DATE) {
        dataFilter.expirationStartDate = this.startDate;
        dataFilter.expirationEndDate = this.endDate;
      } else {
        dataFilter.createdStartDate = this.startDate;
        dataFilter.createdEndDate = this.endDate;
      }
      this.userService.getCurrentAccountFilter(this.tokenData.id, dataFilter).subscribe(
        accountDetails => {
          this.currentAccountData.items = [];
          this.createCurrentAccountData(accountDetails);
          this.submitted = false;
        }, error => {
          this.handlerCurrentAccountError(error);
        },
      );
    }
  }

  downloadCsvFile() {
    this.userService.exportAllCurrentAccount(this.tokenData.id).subscribe(
      data => {
        saveAs(data, `movimientos_cuenta_corrientes_${new Date().getTime()}.csv`);
      },
      error => {
        console.error(error);
      });
  }

  downloadExcelFile() {
    this.userService.exportAllCurrentAccountExcel(this.tokenData.id).subscribe(
      data => {
        saveAs(data, `movimientos_cuenta_corrientes_${new Date().getTime()}.xlsx`);
      },
      error => {
        console.error(error);
      });
  }

  private getCurrentAccountPagination () {
    this.userService.getCurrentAccountByUser(this.tokenData.id, this.limit, this.offset).subscribe((accountDetails) => {
      this.createCurrentAccountData(accountDetails);
      this.submitted = false;
    }, (error) => {
      this.handlerCurrentAccountError(error);
    });
  }

  private createCurrentAccountData (accountDetails) {
    const ticketType = this.authService.getTicketTypesLabel();
    for (const item of accountDetails.items) {
      item['ticketType']  = ticketType[item.tipF];
    }
    this.currentAccountData.items = this.currentAccountData.items.concat(accountDetails.items);
    this.currentAccountData.offset = accountDetails.offset;
    this.currentAccountData.limit = accountDetails.limit;
    this.currentAccountData.total = accountDetails.total;
    this.changeDetectorRef.detectChanges();
  }

  private handlerCurrentAccountError(err): void {
    console.error(err);
    if (err.error) {
      const titleMessage = this.createMessageTranslate('currentAccount.title');
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['error']);
      this.showToast('error', titleMessage, errorTranslated);
    }
    this.submitted = false;
    this.changeDetectorRef.detectChanges();
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
