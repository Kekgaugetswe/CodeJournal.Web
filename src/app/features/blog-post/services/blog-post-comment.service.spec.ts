import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogPostCommentService } from './blog-post-comment.service';

describe('BlogPostCommentService', () => {
  let service: BlogPostCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogPostCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
