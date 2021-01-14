import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToasterConfig, ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { AuthService } from '../../../@core/data/auth.service';
import { UserService } from '../../../@core/data/user.service';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { IGrainStoreModel } from '../../../@core/data/model/grain-store.model';

@Component({
  selector: 'ngx-grain-store',
  templateUrl: './grain-store.component.html',
  styleUrls: ['./grain-store.component.scss'],
})
export class GrainStoreComponent implements OnInit {

  grainStoreData: IGrainStoreModel;
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
    this.grainStoreData = null;
    if (this.tokenData) {
      this.userService.getGrainStoreByUser(this.tokenData.id, this.limit, this.offset).subscribe(
        resp => {
          this.grainStoreData = resp;
          this.changeDetectorRef.detectChanges();
        },
        error => {
          this.handlerError(error);
      });
    }
  }

  searchGrainStore() {
    this.submitted = true;
    this.userService.getGrainStoreFilter(this.tokenData.id, {
      searchByCode: this.searchByCode,
      searchByCose: this.searchByCose,
    }).subscribe(
      grainDetails => {
        if (this.grainStoreData) {
          this.grainStoreData.items = [];
          this.createGrainStoreData(grainDetails);
        }
        this.submitted = false;
        this.changeDetectorRef.detectChanges();
      }, error => {
        this.handlerError(error);
      },
    );
  }

  showMoreData () {
    this.offset = this.offset + this.limit;
    this.getGrainStorePagination();
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
    this.userService.exportAllGrainStoreExcel(this.tokenData.id).subscribe(
      data => {
        saveAs(data, `movimientos_de_acopios_${new Date().getTime()}.xlsx`);
      },
      error => {
        console.error(error);
    });
  }

  private getGrainStorePagination() {
    this.userService.getGrainStoreByUser(this.tokenData.id, this.limit, this.offset).subscribe((grainDetails) => {
      this.createGrainStoreData(grainDetails);
    }, (error) => {
      this.handlerError(error);
    });
  }

  private createGrainStoreData(grainStoreDetails) {
    this.grainStoreData.items = this.grainStoreData.items.concat(grainStoreDetails.items);
    this.grainStoreData.offset = grainStoreDetails.offset;
    this.grainStoreData.limit = grainStoreDetails.limit;
    this.grainStoreData.total = grainStoreDetails.total;
    this.changeDetectorRef.detectChanges();
  }

  private handlerError(err): void {
    console.error(err);
    if (err.error) {
      const titleMessage = this.createMessageTranslate('grainStore.title');
      const errorTranslated = this.getApiErrorMessageTranslate(err.error['code'], err.error['error']);
      this.showToast('error', titleMessage, errorTranslated);
    }
    this.submitted = false;
    this.changeDetectorRef.detectChanges();
  }

  private createMessageTranslate(key, defaultMsg = 'Movimientos de Acopio') {
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
