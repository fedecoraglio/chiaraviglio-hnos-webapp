import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="socials">
      <a href="https://www.facebook.com/chiarahnos" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://www.linkedin.com/company/chiaraviglio-hnos/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
