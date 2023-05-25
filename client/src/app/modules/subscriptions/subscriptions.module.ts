import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { SubscriptionsPageComponent} from "./subscriptions-page/subscriptions-page.component";


@NgModule({
  declarations: [
    SubscriptionsPageComponent
  ],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule
  ]
})
export class SubscriptionsModule { }
