import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  implements OnInit{

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.user().subscribe(user => {
      console.log('Current user:', user);
    });
  }



}
