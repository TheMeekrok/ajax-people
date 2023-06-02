import { Component, OnInit } from '@angular/core';
import { Post } from "../../../shared/models/Post";
import { AdminService } from "../../../shared/services/admin.service";

@Component({
  selector: 'app-unmoderated-posts',
  templateUrl: './unmoderated-posts.component.html',
  styleUrls: ['./unmoderated-posts.component.css']
})
export class UnmoderatedPostsComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }
  posts: Post[]
  areExistPosts: boolean
  loading = true;
  ngOnInit(): void {
    this.adminService.getUnmoderatedPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.areExistPosts = this.posts.length != 0;
      },
      error: (error: Error) => console.log(error),
      complete: () => this.loading = false
      }
    )
  }
}
