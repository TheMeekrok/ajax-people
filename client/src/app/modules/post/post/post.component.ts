import {Component, Input} from '@angular/core'
import {IPost} from "../../../shared/models/Post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  constructor() {
  }
  @Input() post: IPost

}
