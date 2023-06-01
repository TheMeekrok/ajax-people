import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from "../../../shared/services/admin.service";
import { Post } from "../../../shared/models/Post";

@Component({
  selector: 'app-unmoderated-post',
  templateUrl: './unmoderated-post.component.html',
  styleUrls: ['./unmoderated-post.component.css']
})
export class UnmoderatedPostComponent implements OnInit {
  constructor(private adminService: AdminService) {
  }

  @Input() post: Post;
  isVerified: boolean;

  ngOnInit() {
    this.isVerified = false;
  }

  onModeratePost(id: number) {
    this.adminService.moderatePost(id).subscribe({
      error: (error: Error) => console.log(error)
    })
    this.isVerified = true;
  }

  onDeletePost(id: number) {
    this.adminService.deletePost(id).subscribe({
      error: (error: Error) => console.log(error)
    })
    this.isVerified = true;

  }
}
