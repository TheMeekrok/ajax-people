import { Component, Input, OnInit } from '@angular/core';
import { IPost } from '../../../shared/models/Post';
import { IUser } from '../../../shared/models/IUser';
import { MatDialog } from '@angular/material/dialog';
import { FullPostComponent } from '../full-post/full-post.component';
import { PostService } from '../../../shared/services/post.service';
import { UserDataService } from '../../../shared/services/user-data.service';
import { UserDialog } from '../../people/user/user-dialog.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public postService: PostService,
    private userDataService: UserDataService
  ) {}

  @Input() post: IPost;

  loading: boolean;
  avatarPath = '../../../../assets/user/default_avatar.svg';
  user: IUser = {};

  ngOnInit(): void {
    this.tryGetUser(this.post.userId);
  }

  private tryGetUser(userId: number) {
    this.loading = true;

    this.userDataService.getUserById(userId).subscribe({
      next: (result: IUser) => {
        this.user = result;
        this.tryGetAvatar(userId)
      },
      complete: () => this.loading = false,
    })
  }

  private tryGetAvatar(userId: number) {
    this.userDataService.getUserAvatar(userId).subscribe({
      next: (response: string) => {
        if (response) this.avatarPath = `data:image/png;base64,${response}`;
      },
    });
  }

  onShowAuthor(): void {
    this.dialog.open(UserDialog, {
      data: { user: this.user, avatarPath: this.avatarPath },
      width: '450px',
    });
  }
}
