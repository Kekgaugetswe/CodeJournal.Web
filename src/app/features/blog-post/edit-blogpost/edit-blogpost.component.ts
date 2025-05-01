import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Category } from '../../category/models/category-model.model';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css',
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routeSubcription?: Subscription;
  model?: BlogPost;
  categories$?: Observable<Category[]>;

  selectedCategories?: string[];

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService, private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubcription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        //get blogPost from API

        if (this.id) {
          this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories =  response.categories.map(x => x.id);
            }
          });
        }
      },
    });
  }
  // Add any additional methods or properties needed for the component
  ngOnDestroy(): void {
    this.routeSubcription?.unsubscribe();
  }

  onFormSubmit(){

  }
}
