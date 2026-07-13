import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddBlogPostComment } from '../models/add-blog-post-comment';
import { Observable } from 'rxjs';
import { BlogPostComment } from '../models/blog-post-comment';
import { environment } from '../../../../environments/environment';
import { BlogComment } from '../models/blog-comment';

export interface CommentLikeResponse {
  commentId: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BlogPostCommentService {

  constructor(private readonly http: HttpClient) {}

  addComment(request: AddBlogPostComment): Observable<BlogPostComment> {
    return this.http.post<BlogPostComment>(`${environment.apiBaseUrl}/api/blogpost/comment?addAuth=true`, request);
  }

  getComments(blogPostId: string): Observable<BlogComment[]> {
    return this.http.get<BlogComment[]>(
      `${environment.apiBaseUrl}/api/blogpost/${blogPostId}/comments?addAuth=true`
    );
  }

  likeComment(commentId: string): Observable<CommentLikeResponse> {
    return this.http.post<CommentLikeResponse>(
      `${environment.apiBaseUrl}/api/comments/${commentId}/likes?addAuth=true`,
      {}
    );
  }

  unlikeComment(commentId: string): Observable<CommentLikeResponse> {
    return this.http.delete<CommentLikeResponse>(
      `${environment.apiBaseUrl}/api/comments/${commentId}/likes?addAuth=true`
    );
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/api/comments/${commentId}?addAuth=true`
    );
  }
}
