import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmoderatedPostsComponent } from './unmoderated-posts.component';

describe('UnmoderatedPostsComponent', () => {
  let component: UnmoderatedPostsComponent;
  let fixture: ComponentFixture<UnmoderatedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmoderatedPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmoderatedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
