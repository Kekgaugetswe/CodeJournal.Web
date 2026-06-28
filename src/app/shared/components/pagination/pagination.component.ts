import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() totalCount: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  get isPreviousDisabled(): boolean {
    return this.currentPage <= 1;
  }

  get isNextDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (!this.isPreviousDisabled) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (!this.isNextDisabled) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
