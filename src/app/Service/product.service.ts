import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Catalog } from '../Model/catalog';
import { Product } from '../Model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private base_URL: string = 'http://localhost:8080/api/v2/product/';
  private validator_URL: string = 'http://localhost:8080/api/v2/';

  constructor(private http: HttpClient) {}

  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_URL}`);
  }

  addProduct(pro: Product): Observable<Product> {
    return this.http.post<Product>(`${this.base_URL}`, pro);
  }

  updateProduct(id: number, pro: Product): Observable<Product> {
    return this.http.put<Product>(`${this.base_URL}${id}`, pro);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.base_URL}${id}`, { responseType: 'text' });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base_URL}${id}`);
  }

  search(productName: String): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.base_URL + 'search/'}${productName}`
    );
  }

  checkProductName(proName: String): Observable<Boolean> {
    return this.http.get<Boolean>(
      `${this.validator_URL}checkproductname/${proName}`
    );
  }

  checkProductLength(proName: String): Observable<Boolean> {
    return this.http.get<Boolean>(
      `${this.validator_URL}checkproductlength/${proName}`
    );
  }
}
