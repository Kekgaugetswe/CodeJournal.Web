import { Component } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blogpost',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css'
})
export class AddBlogpostComponent {

  model: AddBlogPost;
  constructor( private blogPostService: BlogPostService,private router: Router) {
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featuredImageUrl: '',
      urlHandle: '',
      author: '',
      isVisible: true,
      publishedDate: new Date()
    };
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
