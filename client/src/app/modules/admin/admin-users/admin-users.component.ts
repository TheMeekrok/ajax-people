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

  users: User[];
  displayedColumns: string[] = ["name", "surname", "mail", "rating", "admin", "ban"];
  dataSource: MatTableDataSource<User>;


  constructor(private adminService: AdminService) {
    this.uploadUsers();
  }

  uploadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.dataSource  = new MatTableDataSource(this.users)
        console.log(this.users);

      },
      error: (error: Error) => console.log(error),
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAdminClick(checked: boolean, id: number) {
    this.adminService.appointAnAdmin(id).subscribe({
      error: (error: Error) => console.log(error)
    })
    this.uploadUsers();
  }

  onBunClick(checked: boolean, id: number) {
    console.log("user: " + id + " was banned");
  }
}

