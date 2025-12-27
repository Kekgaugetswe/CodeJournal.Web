import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../models/userdto.model';
import { AddUser } from '../../models/add-user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, OnDestroy {
  user$: Observable<UserDto[]> | undefined;

  addUser: AddUser;
  @ViewChild('closebutton') closebutton: any;
  private addUserSubscription?: Subscription;

  constructor(private userService: UserService) {
    this.addUser = {
      userName: '',
      email: '',
      password: '',
      adminCheckBox: false,
    };
  }

  ngOnInit(): void {
    this.user$ = this.userService.getAllUsers();
  }

  onSubmit() {
    console.log('values in model', this.addUser);
    this.addUserSubscription = this.userService
      .addUser(this.addUser)
      .subscribe({
        next: (response) => {
          console.log('User added successfully', response);
          this.user$ = this.userService.getAllUsers();
          this.closebutton.nativeElement.click();

          // Reset form fields
          this.addUser = {
            userName: '',
            email: '',
            password: '',
            adminCheckBox: false,
          };
        },
      });
  }

  onDelete(id: string){
    const ok = confirm('are you sure you want to delete this user');
    if(!ok) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.user$ = this.userService.getAllUsers();

      },
      error: (err)=> {
        console.error('delete failed', err);
        alert('Delete failed. check console/logs.');
      }
    });
  }


  ngOnDestroy(): void {
    this.addUserSubscription?.unsubscribe();
  }
}
