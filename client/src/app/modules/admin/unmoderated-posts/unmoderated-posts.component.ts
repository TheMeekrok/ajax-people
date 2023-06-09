import { Component, OnInit } from '@angular/core';
import { Post } from "../../../shared/models/Post";
import { AdminService } from "../../../shared/services/admin.service";
import { User } from "../../../shared/models/User";
import { MatTableDataSource } from "@angular/material/table";
import { MatCheckboxChange } from "@angular/material/checkbox";

interface Data {
  post: Post;
  deleteBoxStatus: boolean;
  moderateBoxStatus: boolean;
  isShow: boolean;
}

@Component({
  selector: 'app-unmoderated-posts',
  templateUrl: './unmoderated-posts.component.html',
  styleUrls: ['./unmoderated-posts.component.css']
})

export class UnmoderatedPostsComponent implements OnInit {

  isLoading: boolean;
  constructor(private adminService: AdminService) {

  }
  posts: Post[]
  users: User[];
  displayedColumns: string[] = ["text", "userId", "tags", "actions"];
  dataSource: MatTableDataSource<Data>;

  areExistPosts: boolean

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.getUnmoderatedPosts().subscribe({
        next: (data) => {
          this.posts = data;
          this.areExistPosts = this.posts.length != 0;
          const dataSource: Data[] = [];
          for (const t of this.posts) {
            dataSource.push({
              post: t,
              deleteBoxStatus: false,
              moderateBoxStatus: false,
              isShow: true
            })
          }
          this.dataSource  = new MatTableDataSource(dataSource)
        },
        error: (error: Error) => console.log(error),
        complete: () => this.isLoading = false
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Data, filter: string) => {
      const { post, deleteBoxStatus, moderateBoxStatus } = data;
      const matchesTitle = post.text.toLowerCase().includes(filter);
      const matchesUserId = post.userId.toString().includes(filter);
      let s = "";
      if (post?.tags) {
        post?.tags.map(t => s += t.title + " ");
      }
      const matchesAuthor = s.toLowerCase().includes(filter);
      const matchesDeleteBoxStatus = deleteBoxStatus.toString().toLowerCase().includes(filter);
      const matchesModerateBoxStatus = moderateBoxStatus.toString().toLowerCase().includes(filter);
      return matchesTitle || matchesAuthor || matchesUserId || matchesDeleteBoxStatus || matchesModerateBoxStatus;
    };

    this.dataSource.filter = filterValue;
  }


  onDeleteClick($event: MatCheckboxChange, data: Data) {
    data.isShow = false;
    this.adminService.deletePost(data.post.id).subscribe({
      error: (error: Error) => console.log(error)
    })
  }


  onModerateClick($event: MatCheckboxChange, data: Data) {
    data.isShow = false;
    this.adminService.moderatePost(data.post.id).subscribe({
      error: (error: Error) => console.log(error)
    })
  }
}
