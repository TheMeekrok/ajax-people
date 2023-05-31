import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsPageComponent } from "./tags-page/tags-page.component";

const routes: Routes = [{ path: 'tags', component: TagsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
