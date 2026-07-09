import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../models/userdto.model';
import { AddUser } from '../../models/add-user.model';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: UserDto[] = [];
  allRoles: { id: string; name: string }[] = [];
  isLoading = false;
  searchQuery: string = '';
  currentPage = 1;
  pageSize = 10;

  // Add user modal
  addUser: AddUser = { userName: '', email: '', password: '', adminCheckBox: false };
  @ViewChild('closeAddModal') closeAddModal: any;
  private addUserSub?: Subscription;

  // Edit roles modal
  selectedUser: UserDto | null = null;
  selectedUserRoles: string[] = [];
  rolesLoading = false;
  @ViewChild('closeEditModal') closeEditModal: any;

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userService.getAllRoles().subscribe({ next: (roles) => (this.allRoles = roles) });
  }

  get filteredUsers(): UserDto[] {
    let filtered = this.users;
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.userName.toLowerCase().includes(query)
      );
    }
    return filtered;
  }

  get pagedUsers(): UserDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => { this.users = users; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }

  onSubmit(): void {
    this.addUserSub = this.userService.addUser(this.addUser).subscribe({
      next: () => {
        this.loadUsers();
        this.closeAddModal?.nativeElement.click();
        this.addUser = { userName: '', email: '', password: '', adminCheckBox: false };
      },
    });
  }

  onDelete(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  openEditRoles(user: UserDto): void {
    this.selectedUser = user;
    this.selectedUserRoles = [];
    this.rolesLoading = true;
    this.userService.getUserRoles(user.id).subscribe({
      next: (res) => { this.selectedUserRoles = res.roles; this.rolesLoading = false; },
      error: () => { this.rolesLoading = false; },
    });
  }

  hasRole(roleName: string): boolean {
    return this.selectedUserRoles.includes(roleName);
  }

  onToggleRole(roleName: string, checked: boolean): void {
    if (!this.selectedUser) return;
    const obs = checked
      ? this.userService.assignRole(this.selectedUser.id, roleName)
      : this.userService.removeRole(this.selectedUser.id, roleName);

    obs.subscribe({
      next: () => {
        if (checked) {
          this.selectedUserRoles = [...this.selectedUserRoles, roleName];
        } else {
          this.selectedUserRoles = this.selectedUserRoles.filter((r) => r !== roleName);
        }
      },
      error: (err) => console.error('Role update failed', err),
    });
  }

  ngOnDestroy(): void {
    this.addUserSub?.unsubscribe();
  }
}
