import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username: any = localStorage.getItem('username')

  constructor(private adminService: AdminService) {}

  logout() {
    this.adminService.logout();
  }
}
