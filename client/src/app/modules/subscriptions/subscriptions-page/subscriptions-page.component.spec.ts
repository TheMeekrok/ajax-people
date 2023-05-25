import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsPageComponent } from './subscriptions-page.component';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsPageComponent;
  let fixture: ComponentFixture<SubscriptionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
