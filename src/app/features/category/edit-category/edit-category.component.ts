import { UpdateCategoryRequest } from './../models/update-category-request.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category-model.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  imports: [FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  id: string | null = null;

  paramSubcription?: Subscription;
  editCategorySubscription?: Subscription;

  category?: Category;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.paramSubcription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        if (this.id) {
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (response) => {
              this.category = response;
            },
          });
        }
      },
    });
  }

  onFormSubmit(): void {
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? '',
    };

    if (this.id) {
      this.editCategorySubscription = this.categoryService
        .updateCategory(this.id, updateCategoryRequest)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/categories');
          },
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.categoryService.deleteCategory(this.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/categories');
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.paramSubcription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }
}
