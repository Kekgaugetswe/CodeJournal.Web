import { CategoryService } from './../services/category.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent {
  model: AddCategoryRequest;

  constructor(private categoryService: CategoryService) {
    this.model = {
      name: '',
      urlHandle: '',
    };
  }

  onFormSubmit() {

    this.categoryService.addCategory(this.model)
    .subscribe({
      next: (response) => {
        console.log('Category added successfully', response);
      },
      error: (error) => {
        console.error('Error adding category', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
