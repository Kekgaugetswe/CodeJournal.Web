import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddBlogPostComponent } from '../models/add-blog-post-comment';
import { Observable } from 'rxjs';
import { BlogPostComment } from '../models/blog-post-Post-comment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogPostCommentService {

  constructor(private http: HttpClient) {}

  addComment(request: AddBlogPostComponent): Observable<BlogPostComment> {
    return this.http.post<BlogPostComment>(`${environment.apiBaseUrl}/api/blogpost/comment?addAuth=true`,request)
  }

}
