import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDeleteTagComponent } from './confirmation-delete-tag.component';

describe('ConfirmationDeleteTagComponent', () => {
  let component: ConfirmationDeleteTagComponent;
  let fixture: ComponentFixture<ConfirmationDeleteTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDeleteTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDeleteTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
