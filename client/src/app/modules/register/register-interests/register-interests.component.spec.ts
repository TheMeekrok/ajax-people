import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInterestsComponent } from './register-interests.component';

describe('RegisterInterestsComponent', () => {
  let component: RegisterInterestsComponent;
  let fixture: ComponentFixture<RegisterInterestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterInterestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
