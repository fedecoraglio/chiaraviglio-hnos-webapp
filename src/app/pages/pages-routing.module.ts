import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { CurrentAccountComponent } from './components/current-account/current-account.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { ResetPwdComponent } from './components/reset-pwd/reset-pwd.component';
import { GrainAccountComponent } from './components/grain-account/grain-account.component';
import { GrainStoreComponent } from './components/grain-store/grain-store.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: 'current-account',
      pathMatch: 'full',
    },
    {
      path: 'current-account',
      component: CurrentAccountComponent,
    },
    {
      path: 'grain-account',
      component: GrainAccountComponent,
    },
    {
      path: 'grain-store',
      component: GrainStoreComponent,
    },
    {
      path: 'user-update',
      component: UserUpdateComponent,
    },
    {
      path: 'reset-pwd',
      component: ResetPwdComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
