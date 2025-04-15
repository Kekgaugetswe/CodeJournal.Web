import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


  addCategory(model: AddCategoryRequest): Observable<void> {
    var response = this.http.post<void>('https://localhost:7180/api/category', model);
    console.log('addCategory', response);
    return response;
  }
}
