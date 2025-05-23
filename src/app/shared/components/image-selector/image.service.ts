import { HttpClient } from '@angular/common/http';
import { BlogImage } from './../../models/blog-image.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }



    uploadImage(file: File, fileName: string, title: string): Observable<BlogImage> {

      const formData = new FormData();

      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('title', title);


      return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/images`, formData)
    }
}
