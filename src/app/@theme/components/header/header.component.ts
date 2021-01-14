import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AuthService } from '../../../@core/data/auth.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Cerrar Sesión', link: '/auth/logout' }];

  constructor (private sidebarService: NbSidebarService,
               private menuService: NbMenuService,
               private authService: AuthService,
               private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.authService.currentDataUserUpdated.subscribe(() => {
      this.user = this.authService.getCurrentUser();
      this.changeDetectorRef.detectChanges();
    });
    this.authService.currentDataUserUpdated.subscribe(
      wasUpdate => {
        if (wasUpdate) {
          this.user = this.authService.getCurrentUser();
          this.changeDetectorRef.detectChanges();
        }
      },
    );
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
