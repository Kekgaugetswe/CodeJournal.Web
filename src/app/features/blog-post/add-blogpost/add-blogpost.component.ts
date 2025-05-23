import { CategoryService } from './../../category/services/category.service';
import { Component, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { Observable } from 'rxjs';
import { Category } from '../../category/models/category-model.model';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-blogpost',
  imports: [CommonModule, FormsModule, MarkdownModule,NgMultiSelectDropDownModule ],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css'
})
export class AddBlogpostComponent implements OnInit {

  model: AddBlogPost;
  categories$?: Observable<Category[]>

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    bindValue: 'id'  ,
    bindLabel: 'name'
  };
  constructor( private blogPostService: BlogPostService,private router: Router, private categoryService: CategoryService) {
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featuredImageUrl: '',
      urlHandle: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    };
  }
  ngOnInit(): void {
   this. categories$ = this.categoryService.getAllCategories();


  }

  onFormSubmit() : void{

    this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response)=> {
        this.router.navigateByUrl('/admin/blogposts');

      }
    });

    console.log('Form submitted', this.model);

  }

}
