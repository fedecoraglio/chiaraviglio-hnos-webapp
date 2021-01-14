import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ToasterModule } from 'angular2-toaster';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthComponent } from './auth.component';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { RequestPwdComponent } from './request-pwd/request-pwd.component';

const PAGES_COMPONENT = [
  AuthComponent,
  AuthHeaderComponent,
  LoginComponent,
  RegisterComponent,
  LogoutComponent,
  RequestPwdComponent,
]

@NgModule({
  imports: [
    ThemeModule,
    AuthRoutingModule,
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
    ...PAGES_COMPONENT,
  ],
  entryComponents: [
    ...PAGES_COMPONENT,
  ],
})

export class AuthModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
