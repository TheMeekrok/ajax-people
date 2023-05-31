import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPostComponent } from './success-post.component';

describe('SuccessPostComponent', () => {
  let component: SuccessPostComponent;
  let fixture: ComponentFixture<SuccessPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
