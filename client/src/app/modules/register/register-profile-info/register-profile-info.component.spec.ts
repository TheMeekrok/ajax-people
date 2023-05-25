import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfileInfoComponent } from './register-profile-info.component';

describe('RegisterProfileInfoComponent', () => {
  let component: RegisterProfileInfoComponent;
  let fixture: ComponentFixture<RegisterProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProfileInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
