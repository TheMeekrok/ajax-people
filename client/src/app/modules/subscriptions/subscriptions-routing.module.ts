import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionsPageComponent} from "./subscriptions-page/subscriptions-page.component";

const routes: Routes = [{ path: '', component: SubscriptionsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
