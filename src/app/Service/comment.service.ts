import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Comment } from '../Model/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private base_URL: string = 'http://localhost:8080/api/v2/commentProductUser/';

  constructor(private http: HttpClient) {}

  getAllComment(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base_URL}`);
  }

  getAllUserComment(productId: number, userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base_URL}${productId}/${userId}`);
  }

  getAllCommentByProduct(productId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base_URL}${productId}`);
  }

  postUserComment(comment: Comment, productId: number, userId: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.base_URL}${productId}/${userId}`, comment);
  }

  allComment = new Subject<any>();
}
