import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogPostService } from './../../blog-post/services/blog-post.service';
import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit {

  blogs$?: Observable<BlogPost[]>;

  constructor(private blogPostService: BlogPostService) {
    // Initialization logic can go here if needed
  }

  ngOnInit(): void {
    // You can call any initialization methods here if needed
    this.blogs$ = this.blogPostService.getAllBlogPosts();
  }

}
