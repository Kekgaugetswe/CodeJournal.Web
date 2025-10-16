import { AuthService } from './../../auth/services/auth.service';
import { BlogPostLikeService } from './../../blog-post/services/blog-post-like.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable, tap } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogPostCommentService } from '../../blog-post/services/blog-post-comment.service';
import { AddBlogPostComponent } from '../../blog-post/models/add-blog-post-comment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, MarkdownModule,FormsModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css',
})
export class BlogDetailsComponent implements OnInit {
  url: string | null = null;
  blogPost$?: Observable<BlogPost>;
  commentDescription: string = '';
  blogPostId?: string;

  isLiked = false;
  likeCount = 0;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private blogPostLikeService: BlogPostLikeService,
    private authService: AuthService,
    private blogPostCommentService: BlogPostCommentService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.url = params.get('url');
        if (this.url) {
          this.loadPost(this.url);
        }
      },
    });

    //fetch blog details by url
    if (this.url) {
      this.loadPost(this.url);
    }
  }

  private loadPost(urlHandle: string) {
    const currentUser = this.authService.getUser();
    const userId = currentUser ? currentUser.userId : undefined;
    this.blogPost$ = this.blogPostService
      .getBlogPostByUrlHandle(urlHandle, userId)
      .pipe(
        tap((post) => {
          this.isLiked = post.liked ?? false; // ensure set before async pipe emits
          this.blogPostId = post.id
        })
      );
  }
  onLike(post: BlogPost): void {
    const currentUser = this.authService.getUser();

    if (!currentUser) {
      alert('User not logged in');
      return;
    };

    if (post.liked) return;

    // instantly mark liked for UI
    post.liked = true;

    // persist like in backend
    this.blogPostLikeService
      .addBlogPostLike({ BlogPostId: post.id, UserId: currentUser.userId })
      .subscribe({
        next: () => {
          // fetch new total likes
          this.blogPostLikeService.getTotalLikes(post.id).subscribe({
            next: (count) => {
              post.totalLikes = count;
            },
          });
        },
        error: () => {
          post.liked = false;
        },
      });
  }

  onSubmitComment(){
    const currentUser =this.authService.getUser();

    if(!currentUser || !this.blogPostId){
      alert('user not logged in or post missing');
      return;
    };

    const comment: AddBlogPostComponent = {
      blogPostId : this.blogPostId,
      userId : currentUser.userId,
      description: this.commentDescription
    }
    this.blogPostCommentService.addComment(comment).subscribe({
      next: (response) => {
        console.log('comment added', response);
        this.commentDescription = '';
      },
      error: (err)=> console.error(err)
    });

  }
}
