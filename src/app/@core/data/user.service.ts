
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUserModel } from './model/user.model';
import { ICurrentAccountModel } from './model/current-account.model';
import { Md5 } from 'ts-md5';
import { IGrainCurrentAccountModel } from './model/grain-account.model';
import { IGrainStoreModel } from './model/grain-store.model';

@Injectable()
export class UserService {

  private apiUsersUrl: string;

  constructor(private http: HttpClient) {
    this.apiUsersUrl = environment.apiUrl + '/v1/users';
  }

  getUserById(userId) {
    return this.http.get<IUserModel>(`${this.apiUsersUrl}/${userId}`);
  }

  updateUserData(userData) {
    return this.http.put(`${this.apiUsersUrl}/${userData.id}`, {
      name: userData.name,
    });
  }

  resetPassword(userData) {
    return this.http.put(`${this.apiUsersUrl}/${userData.id}/change-pwd`, {
      password: Md5.hashStr(userData.newPassword),
    });
  }

  getCurrentAccountByUser(userId, limit, offset) {
    return this.http.get<ICurrentAccountModel>(`${this.apiUsersUrl}/${userId}/account-details?limit=${limit}&offset=${offset}`);
  }

  getCurrentAccountFilter(userId, filterData) {
    return this.http.post<ICurrentAccountModel>(`${this.apiUsersUrl}/${userId}/account-details/search?`, filterData);
  }

  getGrainAccountFilter(userId, filterData) {
    return this.http.post<IGrainCurrentAccountModel>(`${this.apiUsersUrl}/${userId}/grain-details/search?`, filterData);
  }

  getGrainAccountByUser(userId, limit, offset) {
    return this.http.get<IGrainCurrentAccountModel>(`${this.apiUsersUrl}/${userId}/grain-details?limit=${limit}&offset=${offset}`);
  }

  getGrainStoreByUser(userId, limit, offset) {
    return this.http.get<IGrainStoreModel>(`${this.apiUsersUrl}/${userId}/grain-store-details?limit=${limit}&offset=${offset}`);
  }

  getGrainStoreFilter(userId, filterData) {
    return this.http.post<IGrainStoreModel>(`${this.apiUsersUrl}/${userId}/grain-store-details/search?`, filterData);
  }

  exportAllCurrentAccount(userId) {
    return this.http.get(`${this.apiUsersUrl}/${userId}/account-details/csv`, {responseType: 'blob'});
  }

  exportAllCurrentAccountExcel(userId) {
    return this.http.get(`${this.apiUsersUrl}/${userId}/account-details/excel`, {responseType: 'blob'});
  }

  exportAllGrainAccount(userId) {
    return this.http.get(`${this.apiUsersUrl}/${userId}/grain-details/csv`, {responseType: 'blob'});
  }

  exportAllGrainAccountExcel(userId) {
    return this.http.get(`${this.apiUsersUrl}/${userId}/grain-details/excel`, {responseType: 'blob'});
  }

  exportAllGrainStoreExcel(userId) {
    return this.http.get(`${this.apiUsersUrl}/${userId}/grain-store-details/excel`, {responseType: 'blob'});
  }
}
