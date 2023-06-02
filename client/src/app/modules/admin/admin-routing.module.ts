import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsPageComponent } from "./tags-page/tags-page.component";
import { UnmoderatedPostsComponent } from "./unmoderated-posts/unmoderated-posts.component";

const routes: Routes = [{ path: 'tags', component: TagsPageComponent}, {path: 'posts', component: UnmoderatedPostsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
