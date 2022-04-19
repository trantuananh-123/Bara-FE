import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../Model/brand';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private base_URL: string = 'http://localhost:8080/api/v2/brand/';

  constructor(private http: HttpClient) {}

  getAllBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.base_URL}`);
  }

  addBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${this.base_URL}`, brand);
  }

  updateBrand(id: number, brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(`${this.base_URL}${id}`, brand);
  }

  deleteBrand(id: number) {
    return this.http.delete(`${this.base_URL}${id}`, { responseType: 'text' });
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.base_URL}${id}`);
  }
}
