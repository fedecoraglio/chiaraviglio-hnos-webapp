import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAuthModel } from './model/auth.model';
import { Md5 } from 'ts-md5/dist/md5';
import { IUserModel } from './model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';
import { TicketTypeService } from './ticket-type.service';

@Injectable()
export class AuthService {

  private apiAuthenticationUrl: string;
  currentDataUserUpdated = new EventEmitter<boolean>();

  constructor(
    private ticketTypeService: TicketTypeService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
  ) {
    this.apiAuthenticationUrl = environment.apiUrl + '/auth';
  }

  login(user) {
    return this.http.post<IAuthModel>(`${this.apiAuthenticationUrl}/login` , {
      'email': user.email,
      'password': Md5.hashStr(user.password),
    });
  }

  createUser(user) {
    return this.http.post<IUserModel>(`${this.apiAuthenticationUrl}/register`, {
      'name': user.name,
      'email': user.email,
      'password': Md5.hashStr(user.password),
      'idNumber': user.idNumber,
    })
  }

  handleAuthentication(token): void {
    if (token) {
      const tokenData = this.jwtHelper.decodeToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('currentTokenData', JSON.stringify(tokenData));
      this.setUserInfoById(tokenData);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('currentTokenData');
      this.validateAuthenticated();
    }
  }

  handlerCurrentUserData(userData) {
    if (userData) {
      localStorage.setItem('currentUserData', JSON.stringify(userData));
    }
  }

  getCurrentTokenData() {
    return JSON.parse(localStorage.getItem('currentTokenData'));
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUserData'));
  }

  updateCurrentUser(userData): void {
    const currentData = JSON.parse(localStorage.getItem('currentUserData'))
    currentData.name = userData.name;
    localStorage.setItem('currentUserData', JSON.stringify(currentData));
    this.currentDataUserUpdated.emit(true);
  }

  getTicketTypesLabel() {
    return JSON.parse(localStorage.getItem('ticketTypesLabel'));
  }

  logout(): void {
    this.cleanUserData();
    // Go back to the home route
    this.router.navigate(['/auth/login']).then(() => {
      location.reload();
    });
  }

  requestPassword(email) {
    return this.http.post(`${this.apiAuthenticationUrl}/reset-password`, {
      email: email,
    });
  }

  cleanUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserData');
    localStorage.removeItem('ticketTypesLabel');
    localStorage.removeItem('ticketTypes');
  }

  validateAuthenticated() {
    const isAuthModule = this.router.url.includes('/auth/');
    if (this.isAuthenticated()) {
      this.loadDataAndGoToDashboard();
    } else {
      if (!isAuthModule) {
        this.router.navigate(['/auth/login']);
      } else {
        // Go to auth page
      }
    }
  }

  private loadDataAndGoToDashboard() {
    if (!localStorage.getItem('ticketTypes')) {
      this.ticketTypeService.getAllTicketTypes().subscribe(
        ticketTypes => {
          const ticketCodeLabel = {};
          for (const t of ticketTypes) {
            ticketCodeLabel[t['code']] = t.description;
          }
          localStorage.setItem('ticketTypesLabel', JSON.stringify(ticketCodeLabel));
          localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
          this.router.navigate(['/pages/current-account']);
        },
        error => {
          console.error(error);
          this.router.navigate(['/pages/current-account']);
        },
      );
    } else {
      // current page.
    }
  }

  private isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && !this.jwtHelper.isTokenExpired(token);
  }

  private setUserInfoById(tokenData) {
    if (tokenData && tokenData.id) {
      this.userService.getUserById(tokenData.id).subscribe((userData) => {
        localStorage.setItem('currentUserData', JSON.stringify(userData));
        this.validateAuthenticated();
      }, (err) => {
        console.error(err);
        this.validateAuthenticated();
      });
    } else {
      this.validateAuthenticated();
    }
  }
}
