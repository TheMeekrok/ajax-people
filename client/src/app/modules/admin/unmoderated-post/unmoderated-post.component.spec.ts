import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmoderatedPostComponent } from './unmoderated-post.component';

describe('UnmoderatedPostComponent', () => {
  let component: UnmoderatedPostComponent;
  let fixture: ComponentFixture<UnmoderatedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmoderatedPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmoderatedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
