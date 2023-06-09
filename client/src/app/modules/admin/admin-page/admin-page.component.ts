import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../../shared/services/admin.service";
import { User } from "../../../shared/models/User";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  arePostsOpen: boolean;

  areUsersOpen: boolean;
  areTagsOpen: boolean;
  user = new User
  constructor(private adminService: AdminService) {
    this.arePostsOpen = false;
    this.areUsersOpen = true;
    this.areTagsOpen = false;
    this.adminService.getAuthorizedUser().subscribe({
      next: (user: User) => this.user = user,
      error: (error: Error) => console.log(error)
    })

  }


  ngOnInit() {
    this.adminService.getAuthorizedUser().subscribe({
      next: (user: User) => this.user = user,
      error: (error: Error) => console.log(error)
    })
  }

  onPostsClick() {
    this.arePostsOpen = true;
    this.areUsersOpen = false;
    this.areTagsOpen = false;
  }

  onUsersClick() {
    this.arePostsOpen = false;
    this.areUsersOpen = true;
    this.areTagsOpen = false;
  }

  onTagsClick() {
    this.arePostsOpen = false;
    this.areUsersOpen = false;
    this.areTagsOpen = true;
  }
}
