import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogPostLikeService } from './blog-post-like.service';

describe('BlogPostLikeService', () => {
  let service: BlogPostLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogPostLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
