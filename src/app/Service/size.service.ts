import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../Model/size';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private base_URL: string = 'http://localhost:8080/api/v2/size/';

  constructor(private http: HttpClient) {}

  getAllSize(): Observable<Size[]> {
    return this.http.get<Size[]>(`${this.base_URL}`);
  }

  addSize(Size: Size): Observable<Size> {
    return this.http.post<Size>(`${this.base_URL}`, Size);
  }

  updateSize(id: number, Size: Size): Observable<Size> {
    return this.http.put<Size>(`${this.base_URL}${id}`, Size);
  }

  deleteSize(id: number) {
    return this.http.delete(`${this.base_URL}${id}`, { responseType: 'text' });
  }

  getSizeById(id: number): Observable<Size> {
    return this.http.get<Size>(`${this.base_URL}${id}`);
  }
}
