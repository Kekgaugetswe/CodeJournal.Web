import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { AddBlogpostComponent } from './add-blogpost.component';

describe('AddBlogpostComponent', () => {
  let component: AddBlogpostComponent;
  let fixture: ComponentFixture<AddBlogpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlogpostComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMarkdown(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlogpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
