import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IPost } from "../../../shared/models/Post";
import { PostService } from "../../../shared/services/post.service";

@Component({
  selector: 'app-full-post',
  templateUrl: './full-post.component.html',
  styleUrls: ['./full-post.component.css']
})
export class FullPostComponent implements OnInit{
  author: string
  date: Date
  constructor(
    private dataService: PostService,
    public dialog: MatDialogRef<FullPostComponent>,

    @Inject(MAT_DIALOG_DATA) public post: IPost,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getUserById(this.post.userId).subscribe(result => {
      this.author = result.firstName + " " + result.lastName;
      this.post.author = result.firstName + " " + result.lastName;
    });
  }
  onCloseClick() {
    this.dialog.close()
  }
}
