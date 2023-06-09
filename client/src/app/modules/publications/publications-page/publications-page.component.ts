import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { CreatePostComponent } from "../create-post/create-post.component";
import { IPost } from "../../../shared/models/Post";
import { PostService } from "../../../shared/services/post.service";
import { MatPaginator } from "@angular/material/paginator";
import { Tag } from "../../../shared/models/Tag";
import { DecimalPipe } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
import { PageEvent } from "@angular/material/paginator";
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.css'],
})

export class PublicationsPageComponent implements OnInit  {
  loading = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('drawer', { static: true }) public drawer: MatDrawer;

  decimalPipe = new DecimalPipe(navigator.language);

  posts: IPost[] = [];
  newPost: IPost;
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
              private postService: PostService,
              private utilsService: UtilsService,
              ) {}

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

    this.changePosts();
    this.initTags();
    this.initPostsCount();
  }

  tagsLoading: boolean;

  private initTags(): void {
    this.tagsLoading = true;

    this.postService.getTags().subscribe(result => {
      this.tags = result;
      this.tagsLoading = false;
    })
  }

  private initPostsCount(): void {
    this.postService.getCountPosts(this.selectedChips).subscribe(result => {
      this.postsCount = result.length;
    })
  }

  onCreatePostClick(): void {
    this.dialog.open(CreatePostComponent, { data: this.newPost });
  }

  changePosts() {
    this.loading = true;
    this.utilsService.scrollToTop();

    this.postService.getPosts(this.orderBy, this.pageIndex + 1, this.pageSize, this.selectedChips).subscribe({
      next: (data: IPost[]) => {
        this.posts = data || [];
        this.areThereAnyPosts = false;
      },
      error: (error: any) => {
        if (error.status == 500) {
          this.posts = [];
          this.areThereAnyPosts = true;
          this.loading = false;
        }
      },
      complete: () => this.loading = false,
    })

    this.postService.getCountPosts(this.selectedChips).subscribe({
      next: (data) => this.postsCount = data ? data.length : 0,
    })
  }

  onPageChange(e: PageEvent): void {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.changePosts();
  }

  onOrderByButtonClick(): void {
    this.orderBy = this.orderBy == 1 ? 0 : 1;
    this.pageIndex = 0;
    this.changePosts();
  }

  onFilterTagsChange(): void {
    this.pageIndex = 0;
    this.changePosts();
  }
}
