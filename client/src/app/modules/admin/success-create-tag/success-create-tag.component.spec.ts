import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessCreateTagComponent } from './success-create-tag.component';

describe('SuccessCreateTagComponent', () => {
  let component: SuccessCreateTagComponent;
  let fixture: ComponentFixture<SuccessCreateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessCreateTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessCreateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
