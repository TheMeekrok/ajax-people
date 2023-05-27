import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { CreatePostComponent } from "../create-post/create-post.component";
import { IPost } from "../../../shared/models/Post";
import { PostService } from "../../../shared/services/post.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Tag } from "../../../shared/models/Tag";
import { DecimalPipe } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";


@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.css'],
})

export class PublicationsPageComponent implements OnInit  {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('drawer', { static: true }) public drawer: MatDrawer;

  decimalPipe = new DecimalPipe(navigator.language);

  posts: IPost[]
  newPost: IPost
  postsCount: number;
  pageSize: number;
  pageIndex: number;
  pageEvent: PageEvent;
  tags: Tag[];
  selectedChips: Tag[];
  orderBy : number;
  areThereAnyPosts : boolean;
  areFiltersOpen: boolean;


  constructor(public dialog: MatDialog,
              private postService: PostService) {}

  ngOnInit() {
    this.postsCount = 0;
    this.pageSize = 5;
    this.pageIndex = 0;
    this.selectedChips = [];
    this.orderBy = 0;
    this.areThereAnyPosts = false;
    this.areFiltersOpen = false;
    this.paginator._intl.itemsPerPageLabel = 'На странице:';

    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, length);
      return `${start} - ${end} из ${this.decimalPipe.transform(length)}`;
    };

    this.postService.getPosts(this.orderBy, this.pageIndex + 1, this.pageSize, this.selectedChips).subscribe(data => {
        this.posts = data;
        this.postsCount = data.length;
        console.log(data);
      }
    )
    this.postService.getTags().subscribe(result => {
      this.tags = result;
    })
    this.postService.getCountPosts(this.selectedChips).subscribe(result => {
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
      this.postService.savePost(result).subscribe()
    });
  }

  /**
   * Метод, вызываемый при людом изменении массива постов:
   * при изменении тэгов-фильтров, сортировки по времени или страницы
   */
  changePosts() {
    this.postService.getPosts(this.orderBy, this.pageIndex + 1, this.pageSize, this.selectedChips).subscribe({
      next: (data) => {
        this.posts = data;
        this.areThereAnyPosts = false;
      },
      error: (error: any) => {
        if (error.status == 500) {
          this.posts = [];
          this.areThereAnyPosts = true;
        }
        else {
          console.log(error);
        }
      }
    })

    this.postService.getCountPosts(this.selectedChips).subscribe({
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

  /**
   * Метод, вызываемый при открытии / закрытии бокового меню с фильтрами
   */
  onAddFiltersClick() {
    if (this.areFiltersOpen) {
      this.selectedChips = [];
      this.changePosts();
    }
    this.areFiltersOpen = !this.areFiltersOpen;
    this.drawer.toggle();
  }
}
