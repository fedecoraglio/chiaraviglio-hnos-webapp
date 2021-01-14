import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ITicketType } from './model/ticket-type.model';

@Injectable()
export class TicketTypeService {

  private apiTicketTypeUrl: string;

  constructor(private http: HttpClient) {
    this.apiTicketTypeUrl = environment.apiUrl + '/v1/tickets/types';
  }

  getAllTicketTypes() {
    return this.http.get<ITicketType[]>(this.apiTicketTypeUrl);
  }
}
