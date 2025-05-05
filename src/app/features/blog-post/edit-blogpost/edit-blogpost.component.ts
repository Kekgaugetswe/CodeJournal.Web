import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Category } from '../../category/models/category-model.model';
import { CategoryService } from '../../category/services/category.service';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageSelectorComponent } from '../../../shared/components/image-selector/image-selector.component';

@Component({
  selector: 'app-edit-blogpost',
  imports: [CommonModule, FormsModule, MarkdownModule, ImageSelectorComponent],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css',
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routeSubcription?: Subscription;
  updateBlogSubcription?: Subscription;
  getBlogSubcription?: Subscription;
  deleteBlogSubcription?: Subscription;

  model?: BlogPost;
  categories$?: Observable<Category[]>;

  selectedCategories?: string[];
  isImageSelectorVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubcription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        //get blogPost from API

        if (this.id) {
          this.getBlogSubcription = this.blogPostService
            .getBlogPostById(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
                this.selectedCategories = response.categories.map((x) => x.id);
              },
            });
        }
      },
    });
  }
  // Add any additional methods or properties needed for the component

  onFormSubmit(): void {
    if (this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        title: this.model.title,
        shortDescription: this.model.shortDescription,
        content: this.model.content,
        featuredImageUrl: this.model.featuredImageUrl,
        urlHandle: this.model.urlHandle,
        author: this.model.author,
        publishedDate: this.model.publishedDate,
        isVisible: this.model.isVisible,
        categories: this.selectedCategories ?? [],
      };

      this.updateBlogSubcription = this.blogPostService
        .UpdateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.deleteBlogSubcription = this.blogPostService
        .deleteBlogPost(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }
  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }
  ngOnDestroy(): void {
    this.routeSubcription?.unsubscribe();
    this.updateBlogSubcription?.unsubscribe();
    this.getBlogSubcription?.unsubscribe();
    this.deleteBlogSubcription?.unsubscribe();
  }
}
