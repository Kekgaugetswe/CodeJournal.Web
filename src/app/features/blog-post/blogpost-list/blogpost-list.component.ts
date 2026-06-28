import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { PaginationMetadata } from '../../../shared/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category-model.model';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent],
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css',
})
export class BlogpostListComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  pagination: PaginationMetadata | null = null;
  searchTitle: string = '';
  currentTitle: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  private readonly pageSize = 10;

  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly categoryService: CategoryService
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
    this.loadPosts(1);
  }

  onSearch(): void {
    this.currentTitle = this.searchTitle.trim();
    this.loadPosts(1);
  }

  onTagChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value || null;
    this.loadPosts(1);
  }

  onPageChange(page: number): void {
    this.loadPosts(page);
  }

  private loadPosts(pageNumber: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    const title = this.currentTitle || undefined;

    this.blogPostService.getPagedBlogPosts(pageNumber, this.pageSize, title, this.selectedCategoryId || undefined).subscribe({
      next: (result) => {
        this.blogPosts = result.data;
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
