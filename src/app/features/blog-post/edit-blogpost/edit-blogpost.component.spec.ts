import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EditBlogpostComponent } from './edit-blogpost.component';

describe('EditBlogpostComponent', () => {
  let component: EditBlogpostComponent;
  let fixture: ComponentFixture<EditBlogpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlogpostComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBlogpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
