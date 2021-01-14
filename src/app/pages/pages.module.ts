import { NgModule } from '@angular/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CurrentAccountComponent } from './components/current-account/current-account.component';
import { ToasterModule } from 'angular2-toaster';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { ResetPwdComponent } from './components/reset-pwd/reset-pwd.component';
import { GrainAccountComponent } from './components/grain-account/grain-account.component';
import { GrainStoreComponent } from './components/grain-store/grain-store.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  CurrentAccountComponent,
  UserUpdateComponent,
  ResetPwdComponent,
  GrainAccountComponent,
  GrainStoreComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    PagesRoutingModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
