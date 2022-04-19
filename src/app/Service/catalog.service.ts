import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Catalog } from '../Model/catalog';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private base_URL: string = 'http://localhost:8080/api/v1/catalog/';

  constructor(private http: HttpClient) {}

  getAllCatalog(): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(`${this.base_URL}`);
  }

  addCatalog(cat: Catalog): Observable<Catalog> {
    return this.http.post<Catalog>(`${this.base_URL}`, cat);
  }

  updateCatalog(id: number, cat: Catalog): Observable<Catalog> {
    return this.http.put<Catalog>(`${this.base_URL}${id}`, cat);
  }

  deleteCatalog(id: number) {
    return this.http.delete(`${this.base_URL}${id}`, { responseType: 'text' });
  }

  getCatalogById(id: number): Observable<Catalog> {
    return this.http.get<Catalog>(`${this.base_URL}${id}`);
  }
}
