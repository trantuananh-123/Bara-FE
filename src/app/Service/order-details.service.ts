import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetails } from '../Model/order-details';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {
  private base_URL = 'http://localhost:8080/api/v2/orderDetails';

  constructor(private http: HttpClient) {}

  getAllOrderDetails(): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${this.base_URL}`);
  }

  addOrderDetails(od: OrderDetails): Observable<OrderDetails> {
    return this.http.post<OrderDetails>(`${this.base_URL}`, od);
  }

  updateOrderDetails(
    order: OrderDetails,
    id: number
  ): Observable<OrderDetails> {
    return this.http.put<OrderDetails>(`${this.base_URL}/${id}`, order);
  }

  deleteOrderDetails(id: number) {
    return this.http.delete(`${this.base_URL}/id`, {
      responseType: 'text',
    });
  }

  getOrderDetailsById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.base_URL}/{id}`);
  }
}
