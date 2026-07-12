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

  private readonly categoryMeta: Record<string, { icon: string; colour: string }> = {
    'Angular': { icon: 'bi-code-slash', colour: '#dd0031' },
    'JavaScript': { icon: 'bi-filetype-js', colour: '#f7df1e' },
    'TypeScript': { icon: 'bi-filetype-tsx', colour: '#3178c6' },
    'CSS': { icon: 'bi-filetype-css', colour: '#264de4' },
    'HTML': { icon: 'bi-filetype-html', colour: '#e34f26' },
    'Node.js': { icon: 'bi-hdd-network', colour: '#339933' },
    '.NET': { icon: 'bi-microsoft', colour: '#512bd4' },
    '.NET & C#': { icon: 'bi-microsoft', colour: '#512bd4' },
    'Python': { icon: 'bi-filetype-py', colour: '#3776ab' },
    'DevOps': { icon: 'bi-gear-wide-connected', colour: '#0078d4' },
    'DevOps & Cloud': { icon: 'bi-cloud-arrow-up', colour: '#0078d4' },
    'Database': { icon: 'bi-database', colour: '#336791' },
    'SQL & Databases': { icon: 'bi-database-fill', colour: '#336791' },
    'APIs': { icon: 'bi-plug', colour: '#ff6b35' },
    'Authentication': { icon: 'bi-shield-lock', colour: '#10b981' },
    'Windows': { icon: 'bi-windows', colour: '#00a4ef' },
    'macOS': { icon: 'bi-apple', colour: '#a2aaad' },
    'VMware': { icon: 'bi-cpu', colour: '#607078' },
    'Troubleshooting': { icon: 'bi-wrench-adjustable', colour: '#f59e0b' },
    'Tutorials': { icon: 'bi-journal-code', colour: '#8b5cf6' },
    'Tips & Tricks': { icon: 'bi-lightbulb', colour: '#eab308' },
    'Frontend UI/UX': { icon: 'bi-palette', colour: '#ec4899' },
    'AI Development': { icon: 'bi-robot', colour: '#06b6d4' },
    'Git & GitHub': { icon: 'bi-git', colour: '#f05032' },
  };

  private readonly defaultMeta = { icon: 'bi-bookmark-star', colour: '#818cf8' };

  private readonly categoryDescriptions: Record<string, string> = {
    'Angular': 'Explore Angular framework tutorials, best practices, and component architecture patterns.',
    'JavaScript': 'Dive into JavaScript fundamentals, ES6+ features, and modern development techniques.',
    'TypeScript': 'Learn TypeScript type system, interfaces, generics, and advanced patterns for safer code.',
    'CSS': 'Master CSS layouts, animations, responsive design, and modern styling techniques.',
    'HTML': 'Understand HTML semantics, accessibility, forms, and modern markup best practices.',
    'Node.js': 'Build server-side applications, REST APIs, and real-time services with Node.js.',
    '.NET': 'Develop robust applications with .NET, C#, ASP.NET Core, and Entity Framework.',
    '.NET & C#': 'Develop robust applications with .NET, C#, ASP.NET Core, and Entity Framework.',
    'Python': 'Explore Python programming, data science, automation, and web development frameworks.',
    'DevOps': 'Learn CI/CD pipelines, containerization, cloud deployment, and infrastructure automation.',
    'DevOps & Cloud': 'Learn CI/CD pipelines, containerization, cloud deployment, and infrastructure automation.',
    'Database': 'Understand database design, SQL queries, NoSQL solutions, and data modeling patterns.',
    'SQL & Databases': 'Understand database design, SQL queries, NoSQL solutions, and data modeling patterns.',
    'APIs': 'Build and consume RESTful APIs, GraphQL endpoints, and service integrations.',
    'Authentication': 'Implement secure authentication, authorization, OAuth, and identity management.',
    'Windows': 'Windows system administration, PowerShell scripting, and desktop development.',
    'macOS': 'macOS development, system utilities, and Apple platform best practices.',
    'VMware': 'Virtualization, VMware administration, and infrastructure management.',
    'Troubleshooting': 'Debug and resolve common development issues, errors, and performance problems.',
    'Tutorials': 'Step-by-step guides and walkthroughs for various technologies and tools.',
    'Tips & Tricks': 'Quick productivity tips, shortcuts, and lesser-known features.',
    'Frontend UI/UX': 'Design principles, UI patterns, accessibility, and user experience best practices.',
    'AI Development': 'Machine learning, AI APIs, prompt engineering, and intelligent applications.',
    'Git & GitHub': 'Version control workflows, branching strategies, and collaboration with Git.',
  };

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
    const mappedDesc = this.categoryDescriptions[category.name];
    if (mappedDesc) {
      return this.truncateText(mappedDesc, 120);
    }
    return 'Articles and tutorials on this topic.';
  }

  truncateText(text: string, limit: number): string {
    if (!text || text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  }

  getCategoryIcon(name: string): string {
    return this.categoryMeta[name]?.icon ?? this.defaultMeta.icon;
  }

  getCategoryColour(name: string): string {
    return this.categoryMeta[name]?.colour ?? this.defaultMeta.colour;
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
