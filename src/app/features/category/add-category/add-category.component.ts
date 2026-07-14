import { CategoryService } from './../services/category.service';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent implements OnDestroy {
  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  selectedAccentColor: string = '';

  presetColors: string[] = [
    '#818cf8', '#6366f1', '#8b5cf6', '#a855f7',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#2563eb', '#4f46e5', '#7c3aed',
  ];

  constructor(private readonly categoryService: CategoryService, private readonly router: Router) {
    this.model = {
      name: '',
      urlHandle: '',
    };
  }

  selectColor(color: string): void {
    this.selectedAccentColor = color;
  }

  onFormSubmit() {
    this.model.accentColor = this.selectedAccentColor || undefined;

    this.addCategorySubscription = this.categoryService.addCategory(this.model)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/categories');
        }
      });
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}
