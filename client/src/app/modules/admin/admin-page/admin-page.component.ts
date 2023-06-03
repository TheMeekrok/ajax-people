import { Component } from '@angular/core';
import { AdminService } from "../../../shared/services/admin.service";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent  {
  isAdmin: true;
  constructor(private adminService: AdminService) {
  }

}
