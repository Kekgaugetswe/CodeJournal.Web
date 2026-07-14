import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../features/category/models/category-model.model';
import { getCategoryVisual } from '../../utils/category-icons';

@Component({
  selector: 'app-category-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-multi-select.component.html',
  styleUrl: './category-multi-select.component.css',
})
export class CategoryMultiSelectComponent implements OnChanges {
  @Input() categories: Category[] | null = [];
  @Input() selectedIds: string[] = [];
  @Output() selectedIdsChange = new EventEmitter<string[]>();

  isOpen = false;
  searchTerm = '';

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Ensure selectedIds is always an array
    if (changes['selectedIds'] && !Array.isArray(this.selectedIds)) {
      this.selectedIds = [];
    }
  }

  get filteredCategories(): Category[] {
    const cats = this.categories || [];
    if (!this.searchTerm.trim()) return cats;
    const term = this.searchTerm.toLowerCase();
    return cats.filter(c => c.name.toLowerCase().includes(term));
  }

  get selectedCategories(): Category[] {
    const cats = this.categories || [];
    return cats.filter(c => this.selectedIds.includes(c.id));
  }

  get selectedCount(): number {
    return this.selectedIds.length;
  }

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  toggleCategory(id: string): void {
    if (this.isSelected(id)) {
      this.selectedIds = this.selectedIds.filter(i => i !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
    this.selectedIdsChange.emit(this.selectedIds);
  }

  removeCategory(id: string): void {
    this.selectedIds = this.selectedIds.filter(i => i !== id);
    this.selectedIdsChange.emit(this.selectedIds);
  }

  clearAll(): void {
    this.selectedIds = [];
    this.selectedIdsChange.emit(this.selectedIds);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.searchTerm = '';
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
  }

  getCategoryIcon(category: Category): string {
    return getCategoryVisual(category).icon;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }
}
