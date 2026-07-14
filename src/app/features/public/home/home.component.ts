import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { PaginationMetadata } from '../../../shared/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category-model.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  blogs: BlogPost[] = [];
  pagination: PaginationMetadata | null = null;
  searchTitle: string = '';
  currentTitle: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  selectedSort: string = 'latest';

  private readonly pageSize = 6;

  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly categoryService: CategoryService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.categories = [];
      },
    });

    // Read categoryId from query params (e.g. from Categories page navigation)
    this.route.queryParams.subscribe((params) => {
      const categoryId = params['categoryId'] || null;
      if (categoryId) {
        this.selectedCategoryId = categoryId;
      }
      this.loadPosts(1);
    });
  }

  onTagSelect(categoryId: string | null): void {
    if (categoryId === this.selectedCategoryId) {
      this.selectedCategoryId = null;
    } else {
      this.selectedCategoryId = categoryId;
    }
    this.loadPosts(1);
  }

  onSearch(): void {
    this.currentTitle = this.searchTitle.trim();
    this.loadPosts(1);
  }

  onSortChange(): void {
    this.loadPosts(1);
  }

  onPageChange(page: number): void {
    this.loadPosts(page);
  }

  private loadPosts(pageNumber: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    const title = this.currentTitle || undefined;

    let sortBy: string | undefined;
    let sortDirection: string | undefined;

    switch (this.selectedSort) {
      case 'latest':
        sortBy = 'date';
        sortDirection = 'desc';
        break;
      case 'oldest':
        sortBy = 'date';
        sortDirection = 'asc';
        break;
      case 'title-asc':
        sortBy = 'title';
        sortDirection = 'asc';
        break;
      case 'title-desc':
        sortBy = 'title';
        sortDirection = 'desc';
        break;
      default:
        sortBy = 'date';
        sortDirection = 'desc';
    }

    this.blogPostService.getPagedBlogPosts(pageNumber, this.pageSize, title, this.selectedCategoryId || undefined, sortBy, sortDirection).subscribe({
      next: (result) => {
        this.blogs = result.data;
        this.pagination = result.pagination;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load blog posts.';
        this.isLoading = false;
      },
    });
  }
}
