import { UpdateBlogPost } from './../models/update-blog-post.model';
import { BlogPost } from './../models/blog-post.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddBlogPost } from './../models/add-blog-post.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginationMetadata } from '../../../shared/models/api-response.model';

export interface PagedBlogPostResult {
  data: BlogPost[];
  pagination: PaginationMetadata;
}

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}

  createBlogPost(data: AddBlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost?addAuth=true`,
      data
    );
  }

  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogpost`);
  }

  getPagedBlogPosts(
    pageNumber: number,
    pageSize: number,
    title?: string,
    categoryId?: string
  ): Observable<PagedBlogPostResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (title && title.trim().length > 0) {
      params = params.set('title', title.trim());
    }

    if (categoryId && categoryId.trim().length > 0) {
      params = params.set('categoryId', categoryId.trim());
    }

    return this.http
      .get<ApiResponse<BlogPost[]>>(`${environment.apiBaseUrl}/api/blogpost`, { params })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return {
            data: response.data,
            pagination: response.pagination!,
          };
        })
      );
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}`
    );
  }

   getBlogPostByUrlHandle(urlHandle: string, userId?: string): Observable<BlogPost> {
    const userParam = userId ? `?userId=${userId}` : '';
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${urlHandle}${userParam}`
    );
  }

  UpdateBlogPost(id: string, updatedBlogPost: UpdateBlogPost): Observable<BlogPost>{

    return this.http.put<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}?addAuth=true`,
      updatedBlogPost
    );
  }

  deleteBlogPost(id: string): Observable<BlogPost> {
    return this.http.delete<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}?addAuth=true`
    );
  }
}
