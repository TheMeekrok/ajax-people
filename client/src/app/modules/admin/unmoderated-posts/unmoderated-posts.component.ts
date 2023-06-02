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

  constructor(private adminService: AdminService) {
    this.adminService.getUnmoderatedPosts().subscribe({
        next: (data) => {
          this.posts = data;
          this.areExistPosts = this.posts.length != 0;
          const datas: Data[] = [];
          for (const t of this.posts) {
            datas.push({
              post: t,
              deleteBoxStatus: false,
              moderateBoxStatus: false,
              isShow: true
            })
          }
          this.dataSource  = new MatTableDataSource(datas)
          console.log(this.dataSource);
        },
        error: (error: Error) => console.log(error),
        complete: () => this.loading = false
      }
    )
  }
  posts: Post[]
  users: User[];
  displayedColumns: string[] = ["text", "userId", "tags", "actions"];
  dataSource: MatTableDataSource<Data>;

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


  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   console.log(event);
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }


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
