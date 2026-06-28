import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BlogpostListComponent } from './blogpost-list.component';

describe('BlogpostListComponent', () => {
  let component: BlogpostListComponent;
  let fixture: ComponentFixture<BlogpostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpostListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogpostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
