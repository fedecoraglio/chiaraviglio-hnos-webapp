import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { StateService } from './state.service';
import { AuthService } from './auth.service';
import { TicketTypeService } from './ticket-type.service';

const SERVICES = [
  UserService,
  StateService,
  AuthService,
  TicketTypeService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
