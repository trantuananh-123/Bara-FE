import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../Model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private base_URL = 'http://localhost:8080/api/v2/orders';

  constructor(private http: HttpClient) {}

  getAllOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base_URL}`);
  }

  addOrder(order: Order, id: number): Observable<Order> {
    return this.http.post<Order>(`${this.base_URL}/${id}`, order);
  }

  updateOrder(order: Order, id: number): Observable<Order> {
    return this.http.put<Order>(`${this.base_URL}/${id}`, order);
  }

  deleteOrder(id: number) {
    return this.http.delete(`${this.base_URL}/${id}`, {
      responseType: 'text',
    });
  }

  getOrderByUser(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base_URL}/${id}`);
  }
}
