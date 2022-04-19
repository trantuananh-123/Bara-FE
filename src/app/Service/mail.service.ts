import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private base_URL = 'http://localhost:8080/api/mail/';

  constructor(private http: HttpClient) {}

  infor: any;
  sendEmail(userId: number, orderId: number) {
    return this.http.post(
      `${this.base_URL}sendMail/${userId}/${orderId}`,
      null,
      { responseType: 'text' }
    );
  }
}
