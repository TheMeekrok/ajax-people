import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicationsPageComponent} from "./publications-page/publications-page.component";

const routes: Routes = [{ path: '', component: PublicationsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationsRoutingModule { }
