import { Component } from '@angular/core';
import { User } from "../../../shared/models/User";
import { AdminService } from "../../../shared/services/admin.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  isLoading: boolean;

  users: User[];
  displayedColumns: string[] = ["name", "surname", "mail", "rating", "admin", "ban"];
  dataSource: MatTableDataSource<User>;


  constructor(private adminService: AdminService,
              private snackBar: MatSnackBar) {
    this.uploadUsers();
  }

  uploadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.dataSource  = new MatTableDataSource(this.users)
      },
      error: (error: Error) => console.log(error),
      complete: () => this.isLoading = false
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  showMessage(message: string) {
    this.snackBar.open(message, "Ок");
  }

  onAdminClick(checked: boolean, id: number) {
    if (checked) {
      this.adminService.appointAnAdmin(id).subscribe({
        error: (error: Error) => console.log(error),
        complete: () => this.showMessage("Пользователь успешно назначен администратором!")
      })
    }
    else {
      this.adminService.deleteFromAdmin(id).subscribe({
        error: (error: Error) => console.log(error),
        complete: () => this.showMessage("Пользователь успешно удалён из администраторов!")

      })
    }
  }

  onBanClick(checked: boolean, id: number) {
    if (checked) {
      this.adminService.banUser(id).subscribe({
        error: (error: Error) => console.log(error),
        complete: () => this.showMessage("Пользователь успешно заблокирован!")
      })
    }
    else {
      this.adminService.unBanUser(id).subscribe({
        error: (error: Error) => console.log(error),
        complete: () => this.showMessage("Пользователь успешно разблокирован!")
      })
    }
  }
}

