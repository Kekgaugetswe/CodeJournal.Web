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
    'Angular': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.93 12.645h4.134L11.996 7.74zM11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z"/></svg>',
      colour: '#dd0031'
    },
    'JavaScript': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.6-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
      colour: '#f7df1e'
    },
    'TypeScript': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>',
      colour: '#3178c6'
    },
    'CSS': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.002l5.355-1.12.856-9.542-13.453-.011L4.57 5.783z"/></svg>',
      colour: '#264de4'
    },
    'HTML': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.014-.004.071-.757.071-.757.071-.756h-12.6l.24 2.573H15.7l-.209 2.417H9.528l.238 2.618h5.675l-.36 3.426-3.083.848-3.072-.848-.222-2.38H6.08l.388 4.555L11.999 20l5.571-1.572L18.5 4.413H5.393z"/></svg>',
      colour: '#e34f26'
    },
    'Node.js': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.921a.28.28 0 0 0-.137-.242l-8.791-5.072a.278.278 0 0 0-.271 0L3.075 6.68a.284.284 0 0 0-.139.241v10.15a.27.27 0 0 0 .139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551l-2.304-1.327A1.85 1.85 0 0 1 1.36 17.07V6.921c0-.645.344-1.248.903-1.57l8.795-5.082a1.926 1.926 0 0 1 1.846 0l8.794 5.082c.559.322.904.924.904 1.57v10.15c0 .645-.345 1.246-.904 1.568l-8.795 5.076c-.28.163-.6.245-.921.245"/></svg>',
      colour: '#339933'
    },
    '.NET': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a3.5 3.5 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.53h1.372zM2.483 10.18a2.353 2.353 0 1 1-2.353-2.353 2.353 2.353 0 0 1 2.353 2.353"/></svg>',
      colour: '#512bd4'
    },
    'Python': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.35.12-.33.2-.28.28-.24.37-.2.48-.13.57-.07.68-.01h.6l.74.05.66.14.59.21.52.27.45.33.39.37.33.41.26.44.21.46.16.48.1.49.07.49z m-6.26 6.07c-.38 0-.69.32-.69.7 0 .39.31.71.69.71.38 0 .69-.32.69-.71 0-.38-.31-.7-.69-.7z m12.05 3.53v3.06l-.02.21-.04.27-.07.32-.1.35-.15.37-.2.36-.27.35-.33.32-.41.27-.5.22-.59.14-.69.05H9.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06h4.06l.21-.03.28-.07.32-.12.35-.18.36-.26.36-.36.35-.46.32-.59.28-.73.21-.88.14-1.05.05-1.23-.06-1.22-.16-1.04-.24-.87-.32-.71-.36-.57-.4-.44-.42-.33-.42-.24-.4-.16-.36-.1-.32-.05-.24-.01h-.16l-.06.01H9.77v.83h4.21l.01 2.75.02.37-.05.35-.12.33-.2.28-.28.24-.37.2-.48.13-.57.07-.68.01h-.6l-.74-.05-.66-.14-.59-.21-.52-.27-.45-.33-.39-.37-.33-.41-.26-.44-.21-.46-.16-.48-.1-.49-.07-.49z m6.26-6.07c.38 0 .69.32.69.7 0 .39-.31.71-.69.71-.38 0-.69-.32-.69-.71 0-.38.31-.7.69-.7z"/></svg>',
      colour: '#3776ab'
    },
    'DevOps': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8.5 2a5.001 5.001 0 0 1 4.905 4.027A3 3 0 0 1 13 12H3.5A3.5 3.5 0 0 1 .035 9.309a3.5 3.5 0 0 1 2.56-4.242A4.98 4.98 0 0 1 8.5 2M.207 9.293a1 1 0 0 0 0 1.414l.94.94a1 1 0 0 0 1.414-1.414l-.94-.94a1 1 0 0 0-1.414 0M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/><path d="M4.862 5.03 3.02 6.872a.75.75 0 0 0 1.06 1.06L5.923 6.09a.75.75 0 0 0-1.06-1.06zm6.06 2.06-1.06-1.06-1.843 1.842a.75.75 0 1 0 1.061 1.061z"/><path d="m11.932 5.04-3.372 3.372a.75.75 0 0 0 1.06 1.06l3.373-3.371a.75.75 0 0 0-1.06-1.06z"/></svg>',
      colour: '#0078d4'
    },
    'Database': {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><ellipse cx="8" cy="3.5" rx="5.5" ry="1.5"/><path d="M2.5 5v2c0 .828 2.462 1.5 5.5 1.5s5.5-.672 5.5-1.5V5c0 .828-2.462 1.5-5.5 1.5S2.5 5.828 2.5 5m0 4v2c0 .828 2.462 1.5 5.5 1.5s5.5-.672 5.5-1.5V9c0 .828-2.462 1.5-5.5 1.5S2.5 9.828 2.5 9"/></svg>',
      colour: '#336791'
    },
  };

  private readonly defaultMeta = {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/></svg>',
    colour: 'var(--primary)'
  };

  private readonly categoryDescriptions: Record<string, string> = {
    'Angular': 'Explore Angular framework tutorials, best practices, and component architecture patterns.',
    'JavaScript': 'Dive into JavaScript fundamentals, ES6+ features, and modern development techniques.',
    'TypeScript': 'Learn TypeScript type system, interfaces, generics, and advanced patterns for safer code.',
    'CSS': 'Master CSS layouts, animations, responsive design, and modern styling techniques.',
    'HTML': 'Understand HTML semantics, accessibility, forms, and modern markup best practices.',
    'Node.js': 'Build server-side applications, REST APIs, and real-time services with Node.js.',
    '.NET': 'Develop robust applications with .NET, C#, ASP.NET Core, and Entity Framework.',
    'Python': 'Explore Python programming, data science, automation, and web development frameworks.',
    'DevOps': 'Learn CI/CD pipelines, containerization, cloud deployment, and infrastructure automation.',
    'Database': 'Understand database design, SQL queries, NoSQL solutions, and data modeling patterns.',
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
