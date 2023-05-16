import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fefu-meeting-service-frontend';
}
