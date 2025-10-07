import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddBlogPostLike } from '../models/add-blog-post-like.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostLikeService {
  constructor(private httpClient: HttpClient){}

  addBlogPostLike(data: AddBlogPostLike): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/api/BlogPostLike/Add?addAuth=true`, data);
  }
}
