import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-app-auth-header',
  styleUrls: ['./auth-header.component.scss'],
  templateUrl: './auth-header.component.html',
})
export class AuthHeaderComponent implements OnInit {

  @Input() position = 'normal';

  constructor() {}

  ngOnInit() {}

  goToHome() {}

}
