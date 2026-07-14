import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { timeout, TimeoutError } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category-model.model';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { PaginationMetadata } from '../../../shared/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { getCategoryVisual } from '../../../shared/utils/category-icons';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Selected category articles view
  selectedCategory: Category | null = null;
  articles: BlogPost[] = [];
  articlesLoading: boolean = false;
  articlesError: string = '';
  pagination: PaginationMetadata | null = null;
  private readonly pageSize = 6;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly blogPostService: BlogPostService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAllCategories().pipe(
      timeout(30000)
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.errorMessage = 'The request timed out. Please try again.';
        } else {
          this.errorMessage = err.message || 'Failed to load categories.';
        }
        this.isLoading = false;
      },
    });
  }

  getDescription(category: Category): string {
    const apiDesc = category.description;
    if (apiDesc && apiDesc.trim().length > 0) {
      return this.truncateText(apiDesc, 120);
    }
    return 'Articles and tutorials on this topic.';
  }

  truncateText(text: string, limit: number): string {
    if (!text || text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  }

  getCategoryIcon(name: string, category?: Category): string {
    if (!category) return 'bi-folder';
    const visual = getCategoryVisual(category);
    // Strip 'bi ' prefix since template adds the 'bi' base class via [ngClass]
    return visual.icon.replace('bi ', '');
  }

  getCategoryColour(name: string, category?: Category): string {
    if (!category) return '#818cf8';
    return getCategoryVisual(category).accent;
  }

  getArticleCountLabel(count: number): string {
    return `${count} articles`;
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.articles = [];
    this.articlesError = '';
    this.loadArticles(1);
  }

  backToCategories(): void {
    this.selectedCategory = null;
    this.articles = [];
    this.articlesError = '';
    this.pagination = null;
  }

  onPageChange(page: number): void {
    this.loadArticles(page);
  }

  loadArticles(pageNumber: number): void {
    if (!this.selectedCategory) return;
    this.articlesLoading = true;
    this.articlesError = '';

    this.blogPostService.getPagedBlogPosts(pageNumber, this.pageSize, undefined, this.selectedCategory.id).subscribe({
      next: (result) => {
        this.articles = result.data;
        this.pagination = result.pagination;
        this.articlesLoading = false;
      },
      error: (err) => {
        this.articlesError = err.message || 'Failed to load articles.';
        this.articlesLoading = false;
      },
    });
  }
}
