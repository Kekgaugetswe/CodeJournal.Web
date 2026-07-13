import { AuthService } from './../../auth/services/auth.service';
import { BlogPostLikeService } from './../../blog-post/services/blog-post-like.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable, tap } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogPostCommentService } from '../../blog-post/services/blog-post-comment.service';
import { AddBlogPostComment } from '../../blog-post/models/add-blog-post-comment';
import { FormsModule } from '@angular/forms';
import { BlogComment } from '../../blog-post/models/blog-comment';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css',
})
export class BlogDetailsComponent implements OnInit {
  @ViewChild('commentTextarea') commentTextarea!: ElementRef<HTMLTextAreaElement>;

  url: string | null = null;
  blogPost$?: Observable<BlogPost>;
  blogPostComments$?: Observable<BlogComment[]>;
  commentDescription: string = '';
  blogPostId?: string;
  isPosting: boolean = false;
  commentCount: number = 0;
  isPreviewMode: boolean = false;
  showEmojiPicker: boolean = false;
  activeFormat: string = '';

  // Reply state
  activeReplyId: string | null = null;
  replyingToUserName: string = '';
  replyDescription: string = '';
  isPostingReply: boolean = false;
  expandedReplies: Set<string> = new Set();

  isLiked = false;
  likeCount = 0;

  readonly emojis = ['😀', '😂', '😍', '🤔', '👍', '👏', '🔥', '🎉', '❤️', '🚀', '💻', '🐛', '✅', '⚡', '💡', '🙌'];

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

    if (this.url) {
      this.loadPost(this.url);
    }
  }

  get currentUser() {
    return this.authService.getUser();
  }

  get userInitial(): string {
    const user = this.currentUser;
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  // ============================================
  // Formatting Methods
  // ============================================

  applyBold(): void {
    this.wrapSelection('**', '**', 'bold text');
    this.flashActive('bold');
  }

  applyItalic(): void {
    this.wrapSelection('*', '*', 'italic text');
    this.flashActive('italic');
  }

  applyLink(): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.commentDescription.substring(start, end);
    const linkText = selected || 'link text';
    const replacement = `[${linkText}](https://example.com)`;

    this.replaceAndSelect(start, end, replacement, start + 1, start + 1 + linkText.length);
    this.flashActive('link');
  }

  applyInlineCode(): void {
    this.wrapSelection('`', '`', 'code');
    this.flashActive('code');
  }

  applyQuote(): void {
    this.prefixLines('> ', 'quote');
    this.flashActive('quote');
  }

  applyBulletList(): void {
    this.prefixLines('- ', 'list item');
    this.flashActive('bullet');
  }

  applyNumberedList(): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.commentDescription.substring(start, end);

    let replacement: string;
    if (selected) {
      const lines = selected.split('\n');
      replacement = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
    } else {
      replacement = '1. list item';
    }

    const newStart = start;
    const newEnd = start + replacement.length;
    this.replaceAndSelect(start, end, replacement, newStart, newEnd);
    this.flashActive('numbered');
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  insertEmoji(emoji: string): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = this.commentDescription.substring(0, start);
    const after = this.commentDescription.substring(end);

    this.commentDescription = before + emoji + after;
    this.showEmojiPicker = false;

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + emoji.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.showEmojiPicker && !target.closest('.emoji-picker-wrapper')) {
      this.showEmojiPicker = false;
    }
  }

  // Keyboard shortcuts
  onTextareaKeydown(event: KeyboardEvent): void {
    const isMeta = event.metaKey || event.ctrlKey;
    if (!isMeta) return;

    if (event.key === 'b' || event.key === 'B') {
      event.preventDefault();
      this.applyBold();
    } else if (event.key === 'i' || event.key === 'I') {
      event.preventDefault();
      this.applyItalic();
    } else if (event.key === 'k' || event.key === 'K') {
      event.preventDefault();
      this.applyLink();
    }
  }

  // Preview mode toggle
  togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  // Render comment markdown for display
  renderCommentMarkdown(text: string): string {
    if (!text) return '';
    let html = this.escapeHtml(text);

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    // Bullet list
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    // Numbered list
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  // ============================================
  // Comment visibility helpers
  // ============================================

  /** Returns true if a comment should be hidden entirely (deleted with no live replies) */
  shouldHideComment(comment: BlogComment): boolean {
    if (!comment.isDeleted) return false;
    // If deleted and has no replies, hide it
    if (!comment.replies || comment.replies.length === 0) return true;
    // If deleted and ALL replies are also deleted, hide it
    return comment.replies.every(r => r.isDeleted);
  }

  /** Returns only non-deleted replies */
  getLiveReplies(comment: BlogComment): BlogComment[] {
    return (comment.replies || []).filter(r => !r.isDeleted);
  }

  /** Count only non-deleted comments and replies */
  private countLiveComments(comments: BlogComment[]): number {
    return comments.filter(c => !c.isDeleted).length +
      comments.reduce((sum, c) => sum + (c.replies?.filter(r => !r.isDeleted).length ?? 0), 0);
  }

  // ============================================
  // Private helpers
  // ============================================

  private wrapSelection(before: string, after: string, placeholder: string): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.commentDescription.substring(start, end);

    const text = selected || placeholder;
    const replacement = before + text + after;

    const selectStart = start + before.length;
    const selectEnd = selectStart + text.length;

    this.replaceAndSelect(start, end, replacement, selectStart, selectEnd);
  }

  private prefixLines(prefix: string, placeholder: string): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.commentDescription.substring(start, end);

    let replacement: string;
    if (selected) {
      const lines = selected.split('\n');
      replacement = lines.map(line => prefix + line).join('\n');
    } else {
      replacement = prefix + placeholder;
    }

    const newStart = start;
    const newEnd = start + replacement.length;
    this.replaceAndSelect(start, end, replacement, newStart, newEnd);
  }

  private replaceAndSelect(start: number, end: number, replacement: string, selectStart: number, selectEnd: number): void {
    const textarea = this.commentTextarea?.nativeElement;
    if (!textarea) return;

    const before = this.commentDescription.substring(0, start);
    const after = this.commentDescription.substring(end);
    this.commentDescription = before + replacement + after;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectStart, selectEnd);
    });
  }

  private flashActive(format: string): void {
    this.activeFormat = format;
    setTimeout(() => {
      if (this.activeFormat === format) {
        this.activeFormat = '';
      }
    }, 600);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================
  // Reply Methods
  // ============================================

  toggleLike(comment: BlogComment): void {
    if (!this.currentUser) {
      alert('Please log in to like comments.');
      return;
    }
    if (comment.isDeleted || comment.isLikeLoading) return;

    comment.isLikeLoading = true;

    if (comment.isLikedByCurrentUser) {
      // Optimistic update
      comment.isLikedByCurrentUser = false;
      comment.likeCount--;

      this.blogPostCommentService.unlikeComment(comment.id).subscribe({
        next: (res) => {
          comment.likeCount = res.likeCount;
          comment.isLikedByCurrentUser = res.isLikedByCurrentUser;
          comment.isLikeLoading = false;
        },
        error: () => {
          // Revert
          comment.isLikedByCurrentUser = true;
          comment.likeCount++;
          comment.isLikeLoading = false;
        }
      });
    } else {
      // Optimistic update
      comment.isLikedByCurrentUser = true;
      comment.likeCount++;

      this.blogPostCommentService.likeComment(comment.id).subscribe({
        next: (res) => {
          comment.likeCount = res.likeCount;
          comment.isLikedByCurrentUser = res.isLikedByCurrentUser;
          comment.isLikeLoading = false;
        },
        error: () => {
          // Revert
          comment.isLikedByCurrentUser = false;
          comment.likeCount--;
          comment.isLikeLoading = false;
        }
      });
    }
  }

  deleteComment(comment: BlogComment): void {
    if (!this.currentUser || comment.isDeleteLoading) return;

    const confirmed = window.confirm('Are you sure you want to delete this comment? This action cannot be undone.');
    if (!confirmed) return;

    comment.isDeleteLoading = true;

    this.blogPostCommentService.deleteComment(comment.id).subscribe({
      next: () => {
        comment.isDeleted = true;
        comment.description = '[This comment has been deleted]';
        comment.isDeleteLoading = false;
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
        comment.isDeleteLoading = false;
      }
    });
  }

  openReply(comment: BlogComment): void {
    this.activeReplyId = comment.id;
    this.replyingToUserName = comment.userName;
    this.replyDescription = '';
  }

  cancelReply(): void {
    this.activeReplyId = null;
    this.replyingToUserName = '';
    this.replyDescription = '';
  }

  submitReply(): void {
    const currentUser = this.authService.getUser();
    if (!currentUser || !this.blogPostId || !this.activeReplyId) return;
    if (!this.replyDescription.trim()) return;

    this.isPostingReply = true;

    const request: AddBlogPostComment = {
      blogPostId: this.blogPostId,
      userId: currentUser.userId,
      description: this.replyDescription,
      parentCommentId: this.activeReplyId
    };

    this.blogPostCommentService.addComment(request).subscribe({
      next: () => {
        this.replyDescription = '';
        this.activeReplyId = null;
        this.replyingToUserName = '';
        this.isPostingReply = false;
        // Reload comments
        this.blogPostComments$ = this.blogPostCommentService.getComments(this.blogPostId!).pipe(
          tap((comments) => {
            this.commentCount = this.countLiveComments(comments);
          })
        );
      },
      error: (err) => {
        console.error(err);
        this.isPostingReply = false;
      }
    });
  }

  toggleReplies(commentId: string): void {
    if (this.expandedReplies.has(commentId)) {
      this.expandedReplies.delete(commentId);
    } else {
      this.expandedReplies.add(commentId);
    }
  }

  isRepliesExpanded(commentId: string): boolean {
    return this.expandedReplies.has(commentId);
  }

  // ============================================
  // Existing functionality (unchanged)
  // ============================================

  private loadPost(urlHandle: string) {
    const currentUser = this.authService.getUser();
    const userId = currentUser ? currentUser.userId : undefined;
    this.blogPost$ = this.blogPostService
      .getBlogPostByUrlHandle(urlHandle, userId)
      .pipe(
        tap((post) => {
          this.isLiked = post.liked ?? false;
          this.blogPostId = post.id;
          this.blogPostComments$ = this.blogPostCommentService.getComments(post.id).pipe(
            tap((comments) => {
              this.commentCount = this.countLiveComments(comments);
            })
          );
        })
      );
  }

  onLike(post: BlogPost): void {
    const currentUser = this.authService.getUser();

    if (!currentUser) {
      alert('User not logged in');
      return;
    }

    if (post.liked) return;

    post.liked = true;

    this.blogPostLikeService
      .addBlogPostLike({ BlogPostId: post.id, UserId: currentUser.userId })
      .subscribe({
        next: () => {
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

  onSubmitComment() {
    const currentUser = this.authService.getUser();

    if (!currentUser || !this.blogPostId) {
      alert('User not logged in or post missing');
      return;
    }

    if (!this.commentDescription.trim()) return;

    this.isPosting = true;

    const comment: AddBlogPostComment = {
      blogPostId: this.blogPostId,
      userId: currentUser.userId,
      description: this.commentDescription
    };

    this.blogPostCommentService.addComment(comment).subscribe({
      next: () => {
        this.commentDescription = '';
        this.isPosting = false;
        this.isPreviewMode = false;
        this.blogPostComments$ = this.blogPostCommentService.getComments(this.blogPostId!).pipe(
          tap((comments) => {
            this.commentCount = this.countLiveComments(comments);
          })
        );
      },
      error: (err) => {
        console.error(err);
        this.isPosting = false;
      }
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
