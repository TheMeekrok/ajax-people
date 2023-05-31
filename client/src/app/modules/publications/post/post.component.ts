import { Component, Input, OnInit } from '@angular/core'
import { IPost } from "../../../shared/models/Post";
import { IUser } from "../../../shared/models/IUser";
import { MatDialog } from "@angular/material/dialog";
import { FullPostComponent } from "../full-post/full-post.component";
import { PostService } from "../../../shared/services/post.service";
import { UserDataService } from "../../../shared/services/user-data.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: IPost
  avatarPath = '../../../../assets/user/default_avatar.svg';
  constructor(
    public dialog: MatDialog,
    public postService: PostService,
    private userDataService: UserDataService
  ) {}
  user: IUser;
  ngOnInit(): void {
    this.getAuthor(this.post.userId);
    this.tryGetAvatar(this.user?.id);
  }

  getAuthor(id: number) {
    this.postService.getUserById(id).subscribe({
      next: (response: IUser) => {
        this.user = response;
        console.log(this.user);
      },
      error: (error:Error) => console.log(error),
    });
  }

  private tryGetAvatar(userId: number | undefined) {
    if (!userId) return;
    this.userDataService.getUserAvatar(userId).subscribe({
      next: (response: string) => {
        if (response) this.avatarPath = `data:image/png;base64,${response}`
      },
    })
  }
  onPostClick(): void {
    const dialogRef = this.dialog.open(FullPostComponent, {
      data: this.post
    });
    dialogRef.afterClosed().subscribe();
  }
}
