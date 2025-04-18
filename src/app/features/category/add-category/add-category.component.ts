import { CategoryService } from './../services/category.service';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent  implements OnDestroy{
  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription

  constructor(private readonly categoryService: CategoryService, private readonly router: Router) {
    this.model = {
      name: '',
      urlHandle: '',
    };
  }

  onFormSubmit() {

    this.addCategorySubscription = this.categoryService.addCategory(this.model)
    .subscribe({
      next: (response) => {

        this.router.navigateByUrl('/admin/categories');
        console.log('Category added successfully', response);
      }
    });
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }


}
