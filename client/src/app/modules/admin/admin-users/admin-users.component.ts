import { Component } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { User } from "../../../shared/models/User";
import { AdminService } from "../../../shared/services/admin.service";


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  isLoading: boolean;
  users: User[];
  displayedColumns: string[] = ["name", "surname", "mail", "rating", "actions"];
  dataSource: MatTableDataSource<User>;


  constructor(private adminService: AdminService) {
    this.uploadUsers();
  }

  uploadUsers() {
    this.isLoading  = true;
    this.adminService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.dataSource  = new MatTableDataSource(this.users)
        console.log(this.users);

      },
      error: (error: Error) => console.log(error),
      complete: () => this.isLoading = false
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAdminClick(id: number) {
    this.adminService.appointAnAdmin(id).subscribe({
      error: (error: Error) => console.log(error)
    })
   this.uploadUsers();
  }

  onBanClick(id: number) {
    console.log("user: " + id + " was banned");
  }
}

