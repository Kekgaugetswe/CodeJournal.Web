import { UpdateCategoryRequest } from './../models/update-category-request.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable, tap } from 'rxjs';
import { Category } from '../models/category-model.model';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private readonly http: HttpClient,
    private cookiService: CookieService
  ) {}

  addCategory(model: AddCategoryRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/category?addAuth=true`,
      model
    );
  }

  getAllCategories(query?: string, sortBy?: string, sortDirection?: string): Observable<Category[]> {

    let params = new HttpParams();

    if(query){
      params = params.set('query', query, )
    }

    if(sortBy){

      params = params.set('sortBy', sortBy)

    }
    if(sortDirection){
      params = params.set('sortDirection', sortDirection)
    }

    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/category`,{
      params: params
    });
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(
      `${environment.apiBaseUrl}/api/category/${id}`
    );
  }

  updateCategory(
    id: string,
    model: UpdateCategoryRequest
  ): Observable<Category> {
    return this.http.put<Category>(
      `${environment.apiBaseUrl}/api/category/${id}?addAuth=true`,
      model,
    );
  }

  deleteCategory(id: string): Observable<Category> {
    return this.http.delete<Category>(
      `${environment.apiBaseUrl}/api/category/${id}?addAuth=true`
    );
  }
}
