import { AuthService } from './../../auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
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
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {

  url: string | null = null;
  blogPost$?: Observable<BlogPost>;


  constructor (private route: ActivatedRoute, private blogPostService: BlogPostService, private blogPostLikeService: BlogPostLikeService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.url = params.get('url');
      }
    });

    //fetch blog details by url
    if(this.url){
      this.blogPost$ = this.blogPostService.getBlogPostByUrlHandle(this.url);
    }

  }
  onLike(): void {

    const currentUser = this.authService.getUser();

    // if(!currentUser){
    //   alert("User not logged in");
    // }
    // if(!this.blogPost$) return;
    // this.blogPost$.subscribe(post => {
    //   this.blogPostLikeService.addBlogPostLike({BlogPostId: post.id, UserId: currentUser?.userId} )
    // })
  }

}
