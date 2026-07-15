import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category-model.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-category-list',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  categories$?: Observable<Category[]>;
  totalCount?: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 10;
  searchQuery: string = '';
  constructor(private readonly categoryService: CategoryService) {}
  ngOnInit(): void {
    this.categoryService.getCategoryCount().subscribe({
      next: (value) => {
        this.totalCount = value;
        this.list = new Array(Math.ceil(value / this.pageSize));

        this.categories$ = this.categoryService.getAllCategories(
          undefined,
          undefined,
          undefined,
          this.pageNumber,
          this.pageSize
        );
      },
    });
  }

  onSearch(query: string) {
    this.categories$ = this.categoryService.getAllCategories(query);
  }

  sort(sortBy: string, sortDirection: string) {
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      sortBy,
      sortDirection
    );
  }

  onPageChange(page: number) {
    this.getPage(page);
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;

    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  getPreviousPage() {
    if (this.pageNumber - 1 > this.list.length) {
      return;
    }
    this.pageNumber -= 1;
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  getNextPage() {
    if (this.pageNumber + 1 > this.list.length) {
      return;
    }
    this.pageNumber += 1;
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }
}
