import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IPost} from "../../../shared/models/Post";
import {DataService} from "../../../shared/services/data.service";

@Component({
  selector: 'app-full-post',
  templateUrl: './full-post.component.html',
  styleUrls: ['./full-post.component.css']
})
export class FullPostComponent implements OnInit{
  author: string
  date: Date
  constructor(
    private dataService: DataService,
    public dialog: MatDialogRef<FullPostComponent>,

    @Inject(MAT_DIALOG_DATA) public data: IPost,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getUserById(this.data.userId).subscribe(result => {
      this.author = result.firstName + " " + result.lastName
      console.log(result)
    });
  }
  onCloseClick() {
    this.dialog.close()
  }


}
