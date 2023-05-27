import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreatePostComponent} from "../create-post/create-post.component";
import {IPost} from "../../../shared/models/Post";
import {DataService} from "../../../shared/services/data.service";
import {PageEvent} from "@angular/material/paginator";
import {Tag} from "../../../shared/models/Tag";
import { NgModel} from "@angular/forms";

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.css']
})
export class PublicationsPageComponent implements OnInit {
  @ViewChild('myInput', { static: true }) ngModel: NgModel;

  posts: IPost[]
  newPost: IPost
  postsCount = 0;
  pageSize = 5;
  pageIndex = 0;
  pageEvent: PageEvent;
  tags: Tag[];
  selectedChips: Tag[] = [];
  orderBy : number = 0;
  isPostsEmpty : boolean = false;

  constructor(public dialog: MatDialog,
              private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPosts(this.orderBy, this.pageIndex + 1, this.pageSize, this.selectedChips).subscribe(data => {
        this.posts = data;
        this.postsCount = data.length;
      }
    )
    this.dataService.getTags().subscribe(result => {
      this.tags = result;
    })
    this.dataService.getCountPosts(this.selectedChips).subscribe(result => {
      this.postsCount = result.length;
    })
  }

  /**
   * Метод, вызываемый при клике на кнопку создая поста. Открывет модальное окно для создания поста
   */

  onCreatePostClick(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      data: this.newPost
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataService.savePost(result).subscribe()
    });
  }


  /**
   * Метод, дызываемый при людом изменении массива постов:
   * при изменении тэгов-фильтров, сортировки по времени или страницы
   */
  changePosts() {
    this.dataService.getPosts(this.orderBy, this.pageIndex + 1, this.pageSize, this.selectedChips).subscribe({
      next: (data) => {
        this.posts = data;
        this.isPostsEmpty = false;
      },
      error: (error: any) => {
        if (error.status == 500) {
          this.posts = [];
          this.isPostsEmpty = true;
        }
        else {
          console.log(error);
        }
      }
    })

    this.dataService.getCountPosts(this.selectedChips).subscribe({
      next: (data) => {
        this.postsCount = data ? data.length : 0;
      },
      error: (error: any) => {
        console.log(error);
        if (error.status == 500) {
        }
      }
    })

  }

  /**
   * Метод, вызываемый при изменении страницы. Меняет настройки пагинатора и обновляет посты
   * @param e  - событие изменения пагинатора
   */
  onPageChange(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.changePosts();
  }

  /**
   * Метод, вызываемый при клине на кнопку сначала новые / старые. Меняет статус кнопки, обнуляет страницу и обновляет посты
   */
  onOrderByButtonClick() {
    this.orderBy = this.orderBy == 1 ? 0 : 1;
    this.pageIndex = 0;
    this.changePosts();
  }

  /**
   * Метод, вызываемый при выборе тэгов-фильтров. Обнуляет страницу и обновляет посты
   */
  onFilterTagsChange() {
    this.pageIndex = 0;
    this.changePosts();
  }
}
