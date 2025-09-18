import { UpdateBlogPost } from './../models/update-blog-post.model';
import { BlogPost } from './../models/blog-post.model';
import { Observable } from 'rxjs';
import { AddBlogPost } from './../models/add-blog-post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}

  createBlogPost(data: AddBlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpostaddAuth=true`,
      data
    );
  }

  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogpost`);
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}`
    );
  }

   getBlogPostByUrlHandle(urlHandle: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${urlHandle}`
    );
  }

  UpdateBlogPost(id: string, updatedBlogPost: UpdateBlogPost): Observable<BlogPost>{

    return this.http.put<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}addAuth=true`,
      updatedBlogPost
    );
  }

  deleteBlogPost(id: string): Observable<BlogPost> {
    return this.http.delete<BlogPost>(
      `${environment.apiBaseUrl}/api/blogpost/${id}?addAuth=true`
    );
  }
}
