import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from '../Model/color';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private base_URL: string = 'http://localhost:8080/api/v2/color/';

  constructor(private http: HttpClient) {}

  getAllColor(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.base_URL}`);
  }

  addColor(color: Color): Observable<Color> {
    return this.http.post<Color>(`${this.base_URL}`, color);
  }

  updateColor(id: number, color: Color): Observable<Color> {
    return this.http.put<Color>(`${this.base_URL}${id}`, color);
  }

  deleteColor(id: number) {
    return this.http.delete(`${this.base_URL}${id}`, { responseType: 'text' });
  }

  getColorById(id: number): Observable<Color> {
    return this.http.get<Color>(`${this.base_URL}${id}`);
  }
}
