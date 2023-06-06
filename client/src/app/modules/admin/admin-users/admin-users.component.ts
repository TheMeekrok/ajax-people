import { Component } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { User } from "../../../shared/models/User";
import { AdminService } from "../../../shared/services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { AdminMesageModalComponent } from "../admin-mesage-modal/admin-mesage-modal.component";


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
        console.log("!!!!");
        console.log(this.users);

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

  onBunClick(checked: boolean, id: number) {
    if (checked) {
      this.adminService.bunUser(id).subscribe({
        error: (error: Error) => console.log(error),
        complete: () => this.showMessage("Пользователь успешно заблокирован!")
      })
    }
  }
}
