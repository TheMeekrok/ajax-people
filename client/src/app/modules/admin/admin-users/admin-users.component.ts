import { Component } from '@angular/core';
import { User } from "../../../shared/models/User";
import { AdminService } from "../../../shared/services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { AdminMesageModalComponent } from "../admin-mesage-modal/admin-mesage-modal.component";
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  users: User[];
  displayedColumns: string[] = ["name", "surname", "mail", "rating", "admin", "ban"];
  dataSource: MatTableDataSource<User>;


  constructor(private adminService: AdminService,
              public dialog: MatDialog) {
    this.uploadUsers();
  }

  uploadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.dataSource  = new MatTableDataSource(this.users)
      },
      error: (error: Error) => console.log(error),
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  showMessage(title: string) {
    this.dialog.open(AdminMesageModalComponent, {
      data: {title: title}
    });
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

