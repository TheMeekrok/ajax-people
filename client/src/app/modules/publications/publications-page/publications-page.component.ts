import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreatePostComponent} from "../create-post/create-post.component";
import {IPost} from "../../../shared/models/Post";
import {DataService} from "../../../shared/services/data.service";

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.css']
})
export class PublicationsPageComponent implements OnInit{
  posts: IPost[]
  newPost: IPost
  constructor(public dialog: MatDialog,
              private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPosts().subscribe(data => {
      this.posts = data
      }
    )
  }


  onCreatePostClick(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      data: this.newPost
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.savePost(result).subscribe()
    });
  }
}
