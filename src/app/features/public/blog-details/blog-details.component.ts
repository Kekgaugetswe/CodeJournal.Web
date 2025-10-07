import { AuthService } from './../../auth/services/auth.service';
import { BlogPostLikeService } from './../../blog-post/services/blog-post-like.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, MarkdownModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css',
})
export class BlogDetailsComponent implements OnInit {
  url: string | null = null;
  blogPost$?: Observable<BlogPost>;

  liked = false;
  likeCount = 0;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private blogPostLikeService: BlogPostLikeService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.url = params.get('url');
      },
    });

    //fetch blog details by url
    if (this.url) {
      this.loadPost(this.url);
    }
  }

  private loadPost(urlHandle: string) {
    this.blogPost$ = this.blogPostService.getBlogPostByUrlHandle(urlHandle);
    this.blogPost$.subscribe((post) => {
      this.likeCount = post.totalLikes ?? 0;
    });
  }
  onLike(post: BlogPost): void {
    const currentUser = this.authService.getUser();

    if (!currentUser) {
      alert('User not logged in');
      return;
    }
    if (!this.blogPost$) return;
    this.blogPost$.subscribe((post) => {
      this.blogPostLikeService
        .addBlogPostLike({ BlogPostId: post.id, UserId: currentUser.userId })
        .subscribe({
          next: () => {
            if (this.url) {
              this.blogPost$ = this.blogPostService.getBlogPostByUrlHandle(
                this.url
              );
            }
          },
        });
    });
  }
}
