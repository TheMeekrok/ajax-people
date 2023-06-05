import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMesageModalComponent } from './admin-mesage-modal.component';

describe('AdminMesageModalComponent', () => {
  let component: AdminMesageModalComponent;
  let fixture: ComponentFixture<AdminMesageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMesageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMesageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
