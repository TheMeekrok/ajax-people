import { Component, Input, OnInit } from '@angular/core'
import { IPost } from "../../../shared/models/Post";
import { IUser } from "../../../shared/models/IUser";
import { MatDialog } from "@angular/material/dialog";
import { FullPostComponent } from "../full-post/full-post.component";
import { PostService } from "../../../shared/services/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: IPost
  constructor(
    public dialog: MatDialog,
    public dataService: PostService
  ) {}
  user: IUser;
  ngOnInit(): void {

    this.dataService.getUserById(this.post.userId).subscribe(result => {
      this.user = result;
    });
    this.getAuthor(this.post.userId);
  }

  getAuthor(id: number) {
    this.dataService.getUserById(id).subscribe({
      next: (response: IUser) => this.user = response,
      error: (error:Error) => console.log(error),
    });
  }

  onPostClick(): void {
    const dialogRef = this.dialog.open(FullPostComponent, {
      data: this.post
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
