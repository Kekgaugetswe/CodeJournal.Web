import { TestBed } from '@angular/core/testing';

import { BlogPostLikeService } from './blog-post-like.service';

describe('BlogPostLikeService', () => {
  let service: BlogPostLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogPostLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
