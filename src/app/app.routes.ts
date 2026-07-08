import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { BlogpostListComponent } from './features/blog-post/blogpost-list/blogpost-list.component';
import { AddBlogpostComponent } from './features/blog-post/add-blogpost/add-blogpost.component';
import { EditBlogpostComponent } from './features/blog-post/edit-blogpost/edit-blogpost.component';
import { HomeComponent } from './features/public/home/home.component';
import { BlogDetailsComponent } from './features/public/blog-details/blog-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { UserListComponent } from './features/auth/users/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'blog/:url',
    component: BlogDetailsComponent,
  },
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts',
    component: BlogpostListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts/add',
    component: AddBlogpostComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts/:id',
    component: EditBlogpostComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [authGuard],
  },
];
