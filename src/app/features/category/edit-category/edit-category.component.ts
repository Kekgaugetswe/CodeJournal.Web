import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category-model.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category',
  imports: [CommonModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  id: string | null = null;

  paramSubcription?: Subscription;

  category?: Category;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly categoryService: CategoryService
  ) {
    // Constructor logic here
  }

  ngOnInit(): void {
    this.paramSubcription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        if (this.id) {
          // get the data fromt the API for this category id
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (response) => {
              this.category = response;
              console.log('Category ID:', this.id);
            },
          });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.paramSubcription?.unsubscribe();
  }
}
