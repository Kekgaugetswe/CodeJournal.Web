import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogPostService } from './blog-post.service';

describe('BlogPostService', () => {
  let service: BlogPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
