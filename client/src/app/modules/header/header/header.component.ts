import { Component } from '@angular/core';
import { AdminService } from "../../../shared/services/admin.service";
import { User } from "../../../shared/models/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAdmin: boolean

  constructor(private adminService: AdminService) {
    this.isAdmin = false;
    this.adminService.getAuthorizedUser().subscribe({
      next: (user: User) => this.isAdmin = user.isAdmin,
      error: (error: Error) => console.log(error)
    })
  }
}
