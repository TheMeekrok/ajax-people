import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreatePostComponent} from "../create-post/create-post.component";
import {IPost} from "../../../shared/models/Post";
export class Post {
  title: string;
  text: string;
}
@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.css']
})
export class PublicationsPageComponent implements OnInit{
  posts$: IPost[]
  newPost: Post
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.newPost = new Post()
    this.posts$ = []
    this.posts$.push(<IPost>this.newPost)
    console.log(this.posts$)
  }

  onCreatePostClick() {
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      data: this.newPost
    });

    dialogRef.afterClosed().subscribe(result => {
      alert(result.text + result.title)
    });
  }
}
